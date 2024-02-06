import { PieceClass } from "@/types/pieces";

export const UNDEFINED_COORD = 1e10;
export const NUMBER_OF_PIECES = 10;

export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 8;

export type BlockTimestamp = {
  updatedAt: number;
};

export type ChessGame = {
  playerWhite: string;
  playerBlack: string;
  gameAddress: string;
  whiteHasSetPieces: boolean;
  blackHasSetPieces: boolean;
  whiteHasPlaecdPieces: boolean;
  blackHasPlacedPieces: boolean;
};

export enum ChessPiecePlayer {
  WHITE = "white",
  BLACK = "black",
}

export type Coordinate = {
  x: number;
  y: number;
};

export type ChessPiece = {
  pieceId?: string;
  tokenId: string;
  pieceClass: PieceClass;
  piecePlayer: ChessPiecePlayer;
  pieceCoords: Coordinate;
  isDead: boolean;
};

export type EthChessPiece = Pick<
  ChessPiece,
  "pieceId" | "tokenId" | "pieceCoords" | "pieceClass" | "isDead"
> &
  BlockTimestamp & {
    publicCommitment: string;
  };

export type BoardChessPiece = ChessPiece &
  BlockTimestamp & {
    // isVisible: boolean;
  };

export type ChessPieceProperties = {
  tokenId: number;
  pieceClass: number;
  isDefaultPiece: boolean;
};

export type TokenBalance = {
  tokenId: number;
  properties?: ChessPieceProperties;
  quantity: number | bigint;
};

export enum ChessPieceTypes {
  KING = "king",
  QUEEN = "queen",
  ROOK = "rook",
  KNIGHT = "knight",
  BISHOP = "bishop",
  PAWN = "pawn",
}

export enum ChessGameState {
  WHITE_SET_PIECES = "WHITE_SET_PIECES",
  BLACK_SET_PIECES = "BLACK_SET_PIECES",
  WHITE_PLACE_PIECES = "WHITE_PLACE_PIECES",
  BLACK_PLACE_PIECES = "BLACK_PLACE_PIECES",
  WHITE_MAKE_MOVE = "WHITE_MAKE_MOVE",
  BLACK_MAKE_MOVE = "BLACK_MAKE_MOVE",
  WHITE_WON = "WHITE_WON",
  BLACK_WON = "BLACK_WON",
  UNKNOWN = "UNKNOWN",
}

export const PieceClassToType = new Map<PieceClass, ChessPieceTypes>([
  [PieceClass.KING, ChessPieceTypes.KING],
  [PieceClass.QUEEN, ChessPieceTypes.QUEEN],
  [PieceClass.BISHOP, ChessPieceTypes.BISHOP],
  [PieceClass.KNIGHT, ChessPieceTypes.KNIGHT],
  [PieceClass.ROOK, ChessPieceTypes.ROOK],
  [PieceClass.PAWN, ChessPieceTypes.PAWN],
]);

export function isValidAddress(address: string): boolean {
  const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
  return ethAddressRegex.test(address);
}
