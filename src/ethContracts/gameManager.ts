import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import { PieceSelection } from "@/types/pieces";
import { AddressLike, Contract, ethers } from "ethers";
import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { ChessGameState } from "@/types";
import { ChessGameContract } from "@/ethContracts/chessGame";

export class GameManagerContract {
  static _instance: Contract;
  static _store: PlayerWalletStore;

  constructor() {}

  static async getInstance(): Promise<Contract> {
    if (!GameManagerContract._instance) {
      GameManagerContract._instance = await this.buildInstance();
    }
    return GameManagerContract._instance;
  }

  static async buildInstance(): Promise<Contract> {
    const db = useFirestore();
    const docRef = doc(db, "eth-deployments/smart-contracts/");
    const store = usePlayerWalletStore() as PlayerWalletStore;
    const result = await getDoc(docRef);
    const data = result.data();
    const chainInformation = data[store.walletChainId][0];
    let signer = await store.provider.getSigner();

    GameManagerContract._store = store;
    return new Contract(
      chainInformation.contracts["GameManager"].address,
      chainInformation.contracts["GameManager"].abi,
      signer
    );
  }

  static async createNewGame(
    playerWhiteAddress: string,
    playerBlackAddress: string
  ): Promise<GameCreatedEvent> {
    const playerWhite = ethers.getAddress(playerWhiteAddress);
    const playerBlack = ethers.getAddress(playerBlackAddress);
    const gameManager = await GameManagerContract.getInstance();
    const tx = await gameManager.createChessGame(playerWhite, playerBlack);
    const rc = await tx.wait();

    const [gameAddress] = rc.logs[0].args;
    return new GameCreatedEvent(
      gameAddress,
      playerWhite,
      playerBlack,
      GameManagerContract._store.walletAddress
    );
  }

  static async setAllocationForGame(
    gameAddress: AddressLike,
    selection: PieceSelection[]
  ) {
    const game = ethers.getAddress(gameAddress);
    const gameManager = await GameManagerContract.getInstance();
    const tx = await gameManager.setPlayerAllocation(game, selection);
    const rc = await tx.wait();
  }

  static async getPlayersGames(player: string): Promise<GameCreatedEvent[]> {
    const gameManager = await GameManagerContract.getInstance();
    let whiteGameFilter = gameManager.filters.GameCreated(null, player, null);
    const whiteGames = await gameManager.queryFilter(
      whiteGameFilter,
      0,
      "latest"
    );
    let blackGameFilter = gameManager.filters.GameCreated(null, null, player);
    const blackGames = await gameManager.queryFilter(
      blackGameFilter,
      0,
      "latest"
    );
    const gameEvents = whiteGames.concat(blackGames);
    let result = gameEvents.map(
      (event) =>
        new GameCreatedEvent(
          event.args[0],
          event.args[1],
          event.args[2],
          player
        )
    );
    return result.filter(
      (obj, index) =>
        index === result.findIndex((o) => o.gameAddress === obj.gameAddress)
    );
  }

  static async getPlayerSelection(
    gameAddress: string,
    playerAddress: string
  ): Promise<PieceSelection[] | undefined> {
    const gameManager = await GameManagerContract.getInstance();
    const filter = gameManager.filters.PlayerSelectedPieces(
      gameAddress,
      playerAddress
    );
    const [event] = await gameManager.queryFilter(filter, 0, "latest");
    if (event) {
      return event.args[2].map((log) => ({
        pieceClass: log[0],
        tokenId: log[1],
        count: log[2],
      }));
    }
    return undefined;
  }

  static async getGameState(gameAddress: string, playerAddress: string) {
    const gameManager = await GameManagerContract.getInstance();
    const chessGame = await ChessGameContract.buildInstance(gameAddress);
    const playerWhite = await chessGame.getPlayerWhite();
    const playerBlack = await chessGame.getPlayerBlack();

    const playerWhiteSelection = await GameManagerContract.getPlayerSelection(
      gameAddress,
      playerWhite
    );
    if (playerWhiteSelection === undefined) {
      return ChessGameState.WHITE_SET_PIECES;
    }

    const playerBlackSelection = await GameManagerContract.getPlayerSelection(
      gameAddress,
      playerBlack
    );
    if (playerBlackSelection === undefined) {
      return ChessGameState.BLACK_SET_PIECES;
    }

    const playerWhitePlacedPieces = await chessGame.getPlayerHasPlacedPieces(
      playerWhite
    );
    if (!playerWhitePlacedPieces) {
      return ChessGameState.WHITE_PLACE_PIECES;
    }

    const playerBlackPlacedPieces = await chessGame.getPlayerHasPlacedPieces(
      playerBlack
    );
    if (!playerBlackPlacedPieces) {
      return ChessGameState.BLACK_PLACE_PIECES;
    }

    if (await chessGame.isGameOver()) {
      const winnerAddress = await chessGame.getGameWinner();
      if (winnerAddress === playerWhite) {
        return ChessGameState.WHITE_WON;
      }
      if (winnerAddress === playerBlack) {
        return ChessGameState.BLACK_WON;
      }
    }

    const isWhitePlayerTurn = await chessGame.isWhitePlayerTurn();
    if (isWhitePlayerTurn) {
      return ChessGameState.WHITE_MAKE_MOVE;
    } else {
      return ChessGameState.BLACK_MAKE_MOVE;
    }

    return ChessGameState.UNKNOWN;
  }
}
export class GameCreatedEvent {
  gameAddress: string;
  playerWhite: string;
  playerBlack: string;

  // The player who is controlling the current client
  // We use it to resolve who the opponent is and similar functionality
  _playingAs: string;

  constructor(
    gameAddress: string,
    playerWhite: string,
    playerBlack: string,
    playingAs: string
  ) {
    (this.gameAddress = gameAddress),
      (this.playerWhite = playerWhite),
      (this.playerBlack = playerBlack);
    this._playingAs = playingAs;
  }

  get opponentAddress() {
    if (this._playingAs === this.playerWhite) {
      return this.playerBlack;
    } else {
      return this.playerWhite;
    }
  }

  get isPlayingAsWhite() {
    console.log(
      "isplaying as white",
      this._playingAs,
      this.playerWhite,
      this.playerBlack
    );
    return this._playingAs === this.playerWhite;
  }

  get isPlayingAsBlack() {
    return this._playingAs === this.playerBlack;
  }
}
