import { defineStore } from "pinia";
import { ethers, Signer, BrowserProvider } from "ethers";
import { fmtShortAddress } from "@/utils";
import { markRaw } from "vue";
import { AddressLike } from "ethers";
import { PieceSelection } from "@/types/pieces";
import { ChessPiece, ChessPiecePlayer, ChessPieceTypes } from "@/types";

export type GamePlayerInfo = {
  pieceSelection: PieceSelection[];
  pieces: ChessPiece;
};

export type Game = {
  playerWhite: GamePlayerInfo;
  playerBlack: GamePlayerInfo;
  isGameOver: boolean;
};

export const useChessGameStore = defineStore("chessGameStore", {
  state: () => ({
    games: new Map<string, Game>(),
  }),
  getters: {
  },
  actions: {
  },
});
