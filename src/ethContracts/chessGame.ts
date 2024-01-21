import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import { ChessPiece, ChessPiecePlayer } from "@/types";
import { PieceSelection } from "@/types/pieces";
import { AddressLike, Contract, ethers } from "ethers";
import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { calculatePublicCommitment } from "@/types/pieces";
import { EthChessPiece } from "@/types";
import chessGameAbi from "./chessGameAbi.json";

export class ChessGameContract {
  _instance: Contract;
  _address: string;

  _playerWhite?: string;
  _playerBlack?: string;

  _whitePieceIds: string[] = [];
  _blackPieceIds: string[] = [];

  static async buildInstance(gameAddress: string): Promise<ChessGameContract> {
    const store = usePlayerWalletStore() as PlayerWalletStore;
    let signer = await store.provider.getSigner();
    const instance = new Contract(gameAddress, chessGameAbi.abi, signer);
    const chessGame = new ChessGameContract(gameAddress, instance);
    await chessGame.getPlayerWhite();
    await chessGame.getPlayerBlack();
    return chessGame;
  }

  constructor(gameAddress: string, instance: Contract) {
    this._instance = instance;
    this._address = gameAddress;
  }

  async getPieceIds() {
    if (!this._whitePieceIds.length) {
      const playerWhite = await this.getPlayerWhite();
      const filter = this._instance.filters.PlayerHasPlacedPieces(playerWhite);
      const [event] = await this._instance.queryFilter(filter, 0, "latest");
      if (event) {
        this._whitePieceIds = event.args[1];
      }
    }
    if (!this._blackPieceIds.length) {
      const playerBlack = await this.getPlayerBlack();
      const filter = this._instance.filters.PlayerHasPlacedPieces(playerBlack);
      const [event] = await this._instance.queryFilter(filter, 0, "latest");
      if (event) {
        this._blackPieceIds = event.args[1];
      }
    }

    return { white: [...this._whitePieceIds], black: [...this._blackPieceIds] };
  }

  async getPlayerWhite() {
    if (!this._playerWhite) {
      this._playerWhite = await this._instance.playerWhite();
    }
    return this._playerWhite;
  }
  async getPlayerBlack() {
    if (!this._playerBlack) {
      this._playerBlack = await this._instance.playerBlack();
    }
    return this._playerBlack;
  }

  async getPlayerHasPlacedPieces(player: string): Promise<boolean> {
    return await this._instance.playerHasPlacedPieces(player);
  }

  async getAllPieces() {
    const whitePieces: EthChessPiece[] = [];
    const { white: whitePieceIds, black: blackPieceIds } =
      await this.getPieceIds();
    for (const pieceId of whitePieceIds) {
      const piece = await this._instance.playerPieces(
        this._playerWhite,
        pieceId
      );
      whitePieces.push({
        pieceId: piece[0],
        tokenId: piece[1],
        pieceClass: piece[2],
        publicCommitment: piece[3],
        pieceCoords: { x: piece[4][0], y: piece[4][1] },
        isDead: piece[5],
        updatedAt: piece[6],
        // updatedAt: 0,
      });
    }

    const blackPieces: EthChessPiece[] = [];
    for (const pieceId of blackPieceIds) {
      const piece = await this._instance.playerPieces(
        this._playerBlack,
        pieceId
      );
      blackPieces.push({
        pieceId: piece[0],
        tokenId: piece[1],
        pieceClass: piece[2],
        publicCommitment: piece[3],
        pieceCoords: { x: piece[4][0], y: piece[4][1] },
        isDead: piece[5],
        updatedAt: piece[6],
        // updatedAt: 0,
      });
    }

    return { white: whitePieces, black: blackPieces };
  }

  async placePieces(pieces: ChessPiece[]) {
    const ethPieces = await calculateCommitments(pieces);
    await this._instance.placePieces(ethPieces);
  }

  async makeMove(piece: ChessPiece, targetPosition: Coordinate) {}

  async reportPositions() {}

  async getPlayerVision(gameAddress: string, playerAddress: string) {
    // playerBoardVision[msg.sender][i]
  }

  async isWhitePlayerTurn() {
    return await this._instance.isWhitePlayerTurn();
  }

  async isGameOver() {
    return await this._instance.isGameOver();
  }

  async getGameWinner(): Promise<string | undefined> {
    const filter = this._instance.filters.GameOver;
    const [event] = await this._instance.queryFilter(filter, 0, "latest");
    if (event) {
      const winnerAddress = event.args[0];
      return winnerAddress;
    }
    return undefined;
  }

  async getPlayerType(playerAddress: string): ChessPiecePlayer {
    const playerWhite = await this.getPlayerWhite();
    // const playerBlack = await this.getPlayerBlack();
    if (playerAddress === playerWhite) {
      return ChessPiecePlayer.WHITE;
    }
    return ChessPiecePlayer.BLACK;
  }

  async getOpponentAddress(playerAddress: string): string {
    const playerWhite = await this.getPlayerWhite();
    const playerBlack = await this.getPlayerBlack();
    if (playerAddress === playerWhite) {
      return playerBlack;
    }
    return playerWhite;
  }
}

async function calculateCommitments(pieces: ChessPiece[]) {
  const ethPieces: EthChessPiece[] = [];

  for (const piece of pieces) {
    ethPieces.push({
      publicCommitment: await calculatePublicCommitment(piece),
      ...piece,
    });
  }
  return ethPieces;
}

export function createPieceMotionProof() {}

export function createRevealPositionProof() {}

export function createPlayerVisionProof() {}
