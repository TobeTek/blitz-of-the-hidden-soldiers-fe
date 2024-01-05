import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import { PieceSelection } from "@/types/pieces";
import { AddressLike, Contract, ethers } from "ethers";
import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";

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
    console.log(data, store.walletChainId);
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
    console.log(rc);
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
      return event.args[2].map((log)=> ({pieceClass: log[0], tokenId:log[1], count:log[2]}));
    }
    return undefined;
  }
}

const GAME_CREATED_EVENT = "GameCreated";
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
}
// (address gameAddress, address indexed playerWhite, address indexed playerBlack);

const PLAYER_SELECTED_PIECES = "PlayerSelectedPieces";
