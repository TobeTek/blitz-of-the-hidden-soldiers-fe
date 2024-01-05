export const UNDEFINED_COORD = 1e10;
export const NUMBER_OF_PIECES = 10;

export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 8;

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
  pieceClass: string;
  piecePlayer: ChessPiecePlayer;
  position: Coordinate;
  isCaptured: boolean;
};

export enum ChessPieceTypes {
  KING = "king",
  QUEEN = "queen",
  ROOK = "rook",
  KNIGHT = "knight",
  BISHOP = "bishop",
  PAWN = "pawn",
}

export function isValidAddress(address: string): boolean {
  const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
  return ethAddressRegex.test(address);
}
