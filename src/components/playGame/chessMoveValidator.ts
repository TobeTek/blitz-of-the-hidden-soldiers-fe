import * as _ from "lodash";

const playerWhiteInitialFEN = "8/8/8/8/8/8/PPPPP3/RNBQK3 w HQha - 0 1";

import {
  ChessPiecePlayer,
  ChessPiece,
  Coordinate,
  ChessPieceTypes,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  UNDEFINED_COORD,
} from "@/types";
import { PieceClass } from "@/types/pieces";

export class ChessMoveValidator {
  static isValidMove(
    chessPiece: ChessPiece,
    initialPosition: Coordinate,
    targetPosition: Coordinate,
    otherPiecePositions: Array<Coordinate>
  ) {
    let isValid = true;
    switch (Number(chessPiece.pieceClass)) {
      case PieceClass.KING:
        isValid &&= this._isValidKingMove(initialPosition, targetPosition);
        break;

      case PieceClass.QUEEN:
        isValid &&= this._isValidQueenMove(initialPosition, targetPosition);
        break;

      case PieceClass.BISHOP:
        isValid &&= this._isValidBishopMove(initialPosition, targetPosition);
        break;

      case PieceClass.ROOK:
        isValid &&= this._isValidRookMove(initialPosition, targetPosition);
        break;

      case PieceClass.KNIGHT:
        isValid &&= this._isValidKnightMove(initialPosition, targetPosition);
        break;

      case PieceClass.PAWN:
        isValid &&= this._isValidPawnMove(
          chessPiece.piecePlayer,
          initialPosition,
          targetPosition
        );
        break;

      default:
        return false;
    }

    const isPathBlocked = Boolean(
      this._isPathBlocked(initialPosition, targetPosition, otherPiecePositions)
    );
    isValid &&= !isPathBlocked;
    return isValid;
  }

  static _isValidKingMove(
    initialPosition: Coordinate,
    targetPosition: Coordinate
  ): boolean {
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 },
    ];

    const legalMoves = directions.map((f) => ({
      x: initialPosition.x + f.dx,
      y: initialPosition.y + f.dy,
    }));

    // Should be a legal move
    if (!containsCoordinate(legalMoves, targetPosition)) {
      return false;
    }
    return true;
  }

  static _isValidQueenMove(
    initialPosition: Coordinate,
    targetPosition: Coordinate
  ): boolean {
    const diagonalSquares = getDiagonalRange(initialPosition);
    const perpendicularSquares = getPerpendicularRange(initialPosition);
    // const perpendicularSquares: Coordinate[] = [];
    const legalMoves = [...diagonalSquares, ...perpendicularSquares];

    // Should be a legal move
    if (!containsCoordinate(legalMoves, targetPosition)) {
      console.log("Illegal move");
      return false;
    }
    return true;
  }

  static _isValidRookMove(
    initialPosition: Coordinate,
    targetPosition: Coordinate
  ) {
    const legalMoves = getPerpendicularRange(initialPosition);

    // Should be a legal move
    if (!containsCoordinate(legalMoves, targetPosition)) {
      return false;
    }

    return true;
  }

  static _isValidBishopMove(
    initialPosition: Coordinate,
    targetPosition: Coordinate
  ) {
    const legalMoves = getDiagonalRange(initialPosition);

    // Should be a legal move
    if (!containsCoordinate(legalMoves, targetPosition)) {
      return false;
    }
    return true;
  }

  static _isValidKnightMove(
    initialPosition: Coordinate,
    targetPosition: Coordinate
  ) {
    const directions = [
      { dx: 1, dy: 2 },
      { dx: -1, dy: 2 },
      { dx: 1, dy: -2 },
      { dx: -1, dy: -2 },
      { dx: 2, dy: 1 },
      { dx: -2, dy: 1 },
      { dx: 2, dy: -1 },
      { dx: -2, dy: -1 },
    ];

    const legalMoves = directions.map((f) => ({
      x: Number(initialPosition.x) + Number(f.dx),
      y: Number(initialPosition.y) + Number(f.dy),
    }));

    console.log("Knight Valid Checks: ", legalMoves, targetPosition);
    // Should be a legal move
    if (!containsCoordinate(legalMoves, targetPosition)) {
      return false;
    }
    return true;
  }

  static _isValidPawnMove(
    piecePlayer: ChessPiecePlayer,
    initialPosition: Coordinate,
    targetPosition: Coordinate
  ) {
    let directions;
    if (piecePlayer == ChessPiecePlayer.WHITE) {
      directions = [{ dx: 0, dy: 1 }];
    } else {
      directions = [{ dx: 0, dy: -1 }];
    }

    const legalMoves = directions.map((f) => ({
      x: initialPosition.x + f.dx,
      y: initialPosition.y + f.dy,
    }));

    // Should be a legal move
    if (!containsCoordinate(legalMoves, targetPosition)) {
      return false;
    }

    return true;
  }

  static _isPathBlocked(
    initialPosition: Coordinate,
    targetPosition: Coordinate,
    otherPiecePositions: Coordinate[]
  ) {
    let blockedSquares: Array<Coordinate> = [];

    for (const piecePosition of otherPiecePositions) {
      if (isEqCoordinate(piecePosition, initialPosition)) {
        continue;
      }
      if (isOnSameLine(targetPosition, initialPosition, piecePosition)) {
        let initialToTarget = cartesianDistance(
          initialPosition,
          targetPosition
        );
        let initialToPiece = cartesianDistance(initialPosition, piecePosition);
        let pieceToTarget = cartesianDistance(piecePosition, targetPosition);
        if (
          initialToTarget > initialToPiece &&
          !(pieceToTarget > initialToTarget)
        ) {
          blockedSquares.push(piecePosition);
        }
      }
    }
    return blockedSquares.length;
  }
}

export class PlayerVisionCalculator {
  static getPieceVision(
    chessPiece: ChessPiece,
    otherPiecePositions: Coordinate[]
  ) {
    let legalMoves: number[][];
    if (
      chessPiece.pieceCoords.x === UNDEFINED_COORD ||
      chessPiece.pieceCoords.y === UNDEFINED_COORD
    ) {
      return PlayerVisionCalculator.createEmptyBoardArray();
    }
    switch (Number(chessPiece.pieceClass)) {
      case PieceClass.KING:
        legalMoves = this._legalKingMoves(chessPiece.pieceCoords);
        break;

      case PieceClass.QUEEN:
        legalMoves = this._legalQueenMoves(chessPiece.pieceCoords);
        break;

      case PieceClass.BISHOP:
        legalMoves = this._legalBishopMoves(chessPiece.pieceCoords);
        break;

      case PieceClass.ROOK:
        legalMoves = this._legalRookMoves(chessPiece.pieceCoords);
        break;

      case PieceClass.KNIGHT:
        legalMoves = this._legalKnightMoves(chessPiece.pieceCoords);
        break;

      case PieceClass.PAWN:
        legalMoves = this._legalPawnMoves(
          chessPiece.piecePlayer,
          chessPiece.pieceCoords
        );
        break;

      default:
        return PlayerVisionCalculator.createEmptyBoardArray();
    }

    this._filterBlockedPaths(
      chessPiece.pieceCoords,
      legalMoves,
      otherPiecePositions
    );
    return legalMoves;
  }

  static _legalKingMoves(initialPosition: Coordinate) {
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 },
    ];

    const legalMoves = PlayerVisionCalculator.createEmptyBoardArray();
    // console.log("LegalMoves:", legalMoves);
    directions.forEach((f) => {
      const coord = {
        x: Math.max(initialPosition.x + f.dx - 1, 0),
        y: Math.max(initialPosition.y + f.dy - 1, 0),
      };
      legalMoves[coord.x][coord.y] = 1;
    });
    return legalMoves;
  }

  static _legalQueenMoves(initialPosition: Coordinate) {
    const diagonalSquares = getDiagonalRange(initialPosition);
    const perpendicularSquares = getPerpendicularRange(initialPosition);

    const legalMoves = PlayerVisionCalculator.createEmptyBoardArray();
    const legalCoords = convertCoordToAbs(
      ...diagonalSquares,
      ...perpendicularSquares
    );
    legalCoords.forEach((coord) => {
      legalMoves[coord.x][coord.y] = 1;
    });

    return legalMoves;
  }

  static _legalRookMoves(initialPosition: Coordinate) {
    const legalCoords = convertCoordToAbs(
      ...getPerpendicularRange(initialPosition)
    );

    const legalMoves = PlayerVisionCalculator.createEmptyBoardArray();
    legalCoords.forEach((coord) => {
      legalMoves[coord.x][coord.y] = 1;
    });

    return legalMoves;
  }

  static _legalBishopMoves(initialPosition: Coordinate) {
    const legalCoords = convertCoordToAbs(...getDiagonalRange(initialPosition));
    const legalMoves = PlayerVisionCalculator.createEmptyBoardArray();
    legalCoords.forEach((coord) => {
      legalMoves[coord.x][coord.y] = 1;
    });

    return legalMoves;
  }

  static _legalKnightMoves(initialPosition: Coordinate) {
    const directions = [
      { dx: 1, dy: 2 },
      { dx: -1, dy: 2 },
      { dx: 1, dy: -2 },
      { dx: -1, dy: -2 },
      { dx: 2, dy: 1 },
      { dx: -2, dy: 1 },
      { dx: 2, dy: -1 },
      { dx: -2, dy: -1 },
    ];

    const legalMoves = PlayerVisionCalculator.createEmptyBoardArray();
    directions.forEach((f) => {
      const coord = {
        x: Math.max(initialPosition.x + f.dx - 1, 0),
        y: Math.max(initialPosition.y + f.dy - 1, 0),
      };
      legalMoves[coord.x][coord.y] = 1;
    });
    return legalMoves;
  }

  static _legalPawnMoves(
    playerType: ChessPiecePlayer,
    initialPosition: Coordinate
  ) {
    let directions;
    if (playerType == ChessPiecePlayer.WHITE) {
      directions = [{ dx: 0, dy: 1 }];
    } else {
      directions = [{ dx: 0, dy: -1 }];
    }

    console.log("PawnInitial:", initialPosition);
    const legalMoves = PlayerVisionCalculator.createEmptyBoardArray();
    directions.forEach((f) => {
      const coord = {
        x: Math.max(initialPosition.x + f.dx - 1, 0),
        y: Math.max(initialPosition.y + f.dy - 1, 0),
      };
      legalMoves[coord.x][coord.y] = 1;
    });
    return legalMoves;
  }

  static _filterBlockedPaths(
    initialPosition: Coordinate,
    legalMoves: number[][],
    otherPiecePositions: Coordinate[]
  ) {
    for (const piecePosition of otherPiecePositions) {
      if (isEqCoordinate(piecePosition, initialPosition)) {
        continue;
      }
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
          if (legalMoves[row][col]) {
            const targetPosition: Coordinate = { x: row, y: col };
            if (isOnSameLine(targetPosition, initialPosition, piecePosition)) {
              let initialToTarget = cartesianDistance(
                initialPosition,
                targetPosition
              );
              let initialToPiece = cartesianDistance(
                initialPosition,
                piecePosition
              );
              let pieceToTarget = cartesianDistance(
                piecePosition,
                targetPosition
              );

              if (
                initialToTarget > initialToPiece &&
                !(pieceToTarget > initialToTarget)
              ) {
                legalMoves[row][col] = 0;
              }
            }
          }
        }
      }
    }
    return legalMoves;
  }

  static createEmptyBoardArray(noCols?: number, noRows?: number) {
    const padValue = 0;
    const column = new Array(noCols ?? BOARD_WIDTH).fill(padValue);
    const result = new Array(noRows ?? BOARD_HEIGHT)
      .fill(null)
      .map((_) => column.slice());
    return result;
  }
}

function getDiagonalRange(initCoord: Coordinate) {
  const coords: Array<Coordinate> = [];

  const directions = [
    { dx: 1, dy: 1 },
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
  ];

  for (const direction of directions) {
    let modCoord = _.cloneDeep(initCoord);

    while (
      modCoord.x > 0 &&
      modCoord.x <= BOARD_WIDTH &&
      modCoord.y > 0 &&
      modCoord.y <= BOARD_HEIGHT
    ) {
      coords.push(modCoord);
      modCoord = {
        x: modCoord.x + direction.dx,
        y: modCoord.y + direction.dy,
      };
    }
  }

  return coords;
}

function getPerpendicularRange(initCoord: Coordinate) {
  const coords: Array<Coordinate> = [];
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
  ];

  for (const direction of directions) {
    let modCoord = _.cloneDeep(initCoord);

    while (
      modCoord.x > 0 &&
      modCoord.x <= BOARD_WIDTH &&
      modCoord.y > 0 &&
      modCoord.y <= BOARD_HEIGHT
    ) {
      coords.push(modCoord);
      modCoord = {
        x: modCoord.x + direction.dx,
        y: modCoord.y + direction.dy,
      };
    }
  }

  return coords;
}

function convertCoordToAbs(...coords: Coordinate[]): Coordinate[] {
  return coords.map((c) => ({ x: c.x - 1, y: c.y - 1 }));
}

export function containsCoordinate(
  arr: Array<Coordinate>,
  position: Coordinate
): number {
  return arr.filter((p) => p.x === position.x && p.y === position.y).length;
}

export function isEqCoordinate(...coordinates: Coordinate[]): boolean {
  if (coordinates.length < 2) {
    // At least two coordinates are required for comparison
    return false;
  }

  const firstCoordinate = coordinates[0];

  for (let i = 1; i < coordinates.length; i++) {
    const currentCoordinate = coordinates[i];

    if (
      firstCoordinate.x !== currentCoordinate.x ||
      firstCoordinate.y !== currentCoordinate.y
    ) {
      return false; // Coordinates are not equal
    }
  }

  return true; // All coordinates are equal
}

export function isOnSameLine(
  refCoord: Coordinate,
  coord1: Coordinate,
  coord2: Coordinate
) {
  // Convert BigInt to number
  [refCoord.x, refCoord.y] = [Number(refCoord.x), Number(refCoord.y)];
  [coord1.x, coord1.y] = [Number(coord1.x), Number(coord1.y)];
  [coord2.x, coord2.y] = [Number(coord2.x), Number(coord2.y)];

  let slope1 = (refCoord.y - coord1.y) / (refCoord.x - coord1.x),
    slope2 = (refCoord.y - coord2.y) / (refCoord.x - coord2.x);
  return slope1 == slope2;
}

export function cartesianDistance(
  coord1: Coordinate,
  coord2: Coordinate
): number {
  return Math.sqrt((coord1.x - coord2.x) ** 2 + (coord1.y - coord2.y) ** 2);
}

export function padArray(
  arr: number[][],
  targetDims: number[],
  initialPosition: number[],
  padValue: any
) {
  const [noRows, noCols] = targetDims;
  const column = new Array(noCols).fill(padValue);
  const result = new Array(noRows).fill(null).map((e) => column.slice());

  for (let row = 0; row < noRows; row++) {
    for (let col = 0; col < noCols; col++) {
      const [initialRow, initialCol] = initialPosition;
      const [rowIndx, colIndx] = [row - initialRow, col - initialCol];
      console.log("RowIndx: ", rowIndx, " ColIndx: ", colIndx);
      if (arr[rowIndx] !== undefined) {
        result[row][col] = arr[rowIndx][colIndx] ?? padValue;
        console.log(result[row][col], arr[rowIndx][colIndx]);
      } else {
        result[row][col] = padValue;
      }
    }
  }
  return result;
}

// Element-wise OR operation on arrays
export function arrayOR(...arrs: number[][][]) {
  const expectedRows = arrs[0].length;
  const expectedCols = arrs[0][0].length;

  for (const arr of arrs) {
    if (arr.length !== expectedRows && arr[0].length != expectedCols) {
      throw new Error(
        `Arrays in the list have different lengths: expected ${expectedRows},${expectedCols}, found ${array.length},${array[0].length}`
      );
    }
  }

  const col = new Array(expectedCols).fill(0);
  const result = new Array(expectedRows).fill(null).map((_) => col);
  for (const arr of arrs) {
    for (const [rowIndx, row] of arr.entries()) {
      for (const [colIndx, col] of row.entries()) {
        result[rowIndx][colIndx] = Number(result[rowIndx][colIndx] || col);
      }
    }
  }

  return result;
}
