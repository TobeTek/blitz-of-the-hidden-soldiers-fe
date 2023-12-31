import { mimcHashMulti } from "@src/utils/hashers";
export const UNDEFINED_COORD = 1e10;
export const NUMBER_OF_PIECES = 10;
export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 8;

export type Coordinate = {
  x: number;
  y: number;
};

export type Piece = {
  pieceId: number;
  pieceClass: PieceClass;
  pieceCoords?: Coordinate;
};

export type EthPiece = Piece & {
  tokenId: number;
  publicCommitment?: number | string;
  isDead: boolean;
};

export async function calculatePublicCommitment(p: EthPiece): Promise<string> {
  return await mimcHashMulti([
    p.pieceId,
    p.pieceClass,
    p.pieceCoords?.x,
    p.pieceCoords?.y,
  ]);
}

export enum PieceClass {
  // Standard Pieces
  KING,
  QUEEN,
  BISHOP,
  KNIGHT,
  ROOK,
  PAWN,

  // Exotic
  TREBUCHET,
}

export type PieceSelection = {
  pieceClass: PieceClass;
  tokenId: number;
  count: number;
};

export enum KingTokens {
  STANDARD_KING = 1000,
  MAHARAJA_KING = 1002,
  DEVARAJA_KING = 1004,
  MANSA_KING = 1006,
  NEGUS_KING = 1008,

  // Single Edition
  ALEXANDER_THE_GREAT = 1100,
}

export enum QueenTokens {
  STANDARD_QUEEN = 2000,
  PALATINI_QUEEN = 2002,
}

export enum BishopTokens {
  STANDARD_BISHOP = 3000,
  VARANGIAN_GUARD_BISHOP = 3002,
  SAMURAI_BISHOP = 3004,
}

export enum KnightTokens {
  STANDARD_KNIGHT = 4000,
  SAGITTARII_KNIGHT = 4002,
  STRADIOTI_KNIGHT = 4004,
}

export enum RookTokens {
  STANDARD_ROOK = 5000,
  PAVISE_ROOK = 5002,
  JANISSARIES_ROOK = 5004,
}

export enum PawnTokens {
  STANDARD_PAWN = 6000,
  HOPLITES_PAWN = 6002,
  LIMITANEI_PAWN = 6004,
  CONQUISTADORS_PAWN = 6006,
  MAMLUKS_PAWN = 6008,
}
