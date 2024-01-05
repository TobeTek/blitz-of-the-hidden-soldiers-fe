import * as _ from "lodash";

const playerWhiteInitialFEN = "8/8/8/8/8/8/PPPPP3/RNBQK3 w HQha - 0 1";
import { usePlayerWalletStore } from "@/stores/playerWallet";

import {
  ChessPiecePlayer,
  ChessPiece,
  Coordinate,
  ChessPieceTypes,
  BOARD_HEIGHT,
  BOARD_WIDTH,
} from "@/types";

export class ChessMoveValidator {
  static isValidMove(
    chessPiece: ChessPiece,
    initialPosition: Coordinate,
    targetPosition: Coordinate,
    otherPiecePositions: Array<Coordinate>
  ) {
    let isValid = true;
    switch (chessPiece.pieceType) {
      case ChessPieceTypes.KING:
        isValid &&= this._isValidKingMove(initialPosition, targetPosition);
        break;

      case ChessPieceTypes.QUEEN:
        isValid &&= this._isValidQueenMove(initialPosition, targetPosition);
        break;

      case ChessPieceTypes.BISHOP:
        isValid &&= this._isValidBishopMove(initialPosition, targetPosition);
        break;

      case ChessPieceTypes.ROOK:
        isValid &&= this._isValidRookMove(initialPosition, targetPosition);
        break;

      case ChessPieceTypes.KNIGHT:
        isValid &&= this._isValidKnightMove(initialPosition, targetPosition);
        break;

      case ChessPieceTypes.PAWN:
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
    console.log(isValid, isPathBlocked);
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
    const diagonalSquares = getDiagonalRange(initialPosition, targetPosition);
    const perpendicularSquares = getPerpendicularRange(
      initialPosition,
      targetPosition
    );
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
    const legalMoves = getPerpendicularRange(initialPosition, targetPosition);

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
    const legalMoves = getDiagonalRange(initialPosition, targetPosition);

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
      x: initialPosition.x + f.dx,
      y: initialPosition.y + f.dy,
    }));

    // Should be a legal move
    if (!containsCoordinate(legalMoves, targetPosition)) {
      return false;
    }
    return true;
  }

  static _isValidPawnMove(
    pieceType: ChessPiecePlayer,
    initialPosition: Coordinate,
    targetPosition: Coordinate
  ) {
    let directions;
    if (pieceType == ChessPiecePlayer.WHITE) {
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
        let targetDistance = cartesianDistance(targetPosition, initialPosition);
        let otherPieceDistance = cartesianDistance(
          piecePosition,
          initialPosition
        );

        // If player piece, it's non-inclusive boundary
        if (targetDistance > otherPieceDistance) {
          blockedSquares.push(piecePosition);
        }
      }
    }
    return blockedSquares.length;
  }
}

function getDiagonalRange(initCoord: Coordinate, targetCoord: Coordinate) {
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

function getPerpendicularRange(initCoord: Coordinate, targetCoord: Coordinate) {
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
  let slope1 = (refCoord.y - coord1.y) / (refCoord.x - coord1.x),
    slope2 = (refCoord.y - coord2.y) / (refCoord.x - coord2.x);
  return slope1 == slope2;
}

function cartesianDistance(coord1: Coordinate, coord2: Coordinate): number {
  return Math.sqrt((coord1.x - coord2.x) ** 2 + (coord1.y - coord2.y) ** 2);
}
