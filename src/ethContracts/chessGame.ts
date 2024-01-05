import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import { PieceSelection } from "@/types/pieces";
import { AddressLike, Contract, ethers } from "ethers";
import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";

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
    const instance = new Contract(gameAddress, chessGameAbi, signer);
    return new ChessGameContract(gameAddress, instance);
  }

  constructor(gameAddress: string, instance: Contract) {
    this._instance = instance;
    this._address = gameAddress;
  }

  async makeMove(piece: ChessPiece, targetPosition: Coordinate) {}

  async reportPositions() {}

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

  async getPlayerHasPlacedPieces(player: string): Promise<boolean>{
    return await this._instance.playerHasPlacedPieces(player)
  }

  async getAllPositions(): Promise<ChessPiece[]> {}
}

export function createPieceMotionProof() {}

export function createRevealPositionProof() {}

export function createPlayerVisionProof() {}

const chessGameAbi = require("./chessGameAbi.json").abi;
