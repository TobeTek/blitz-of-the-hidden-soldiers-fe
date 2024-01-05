<template>
  <div id="wrap">
    <div id="chess-pieces">
      <template v-for="piece in pieces" :key="piece.pieceCoords">
        <ChessPieceComponent
          v-if="!piece.isDead"
          :piece="piece"
          @piece-selected="clickPiece($event)"
          @piece-deselected="deselectPiece($event)"
        />
      </template>
    </div>
    <table id="chess-board">
      <tr v-for="row in boardCoordinateRange()">
        <BoardSquare
          v-for="col in 8"
          :pieceClass="'pawn'"
          :playerType="'white'"
          :row="row"
          :col="col"
          @click="makeMove(row, col)"
        ></BoardSquare>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import BoardSquare from "@/components/playGame/BoardSquare.vue";
import ChessPieceComponent from "@/components/playGame/ChessPieceComponent.vue";
import {
  ChessMoveValidator,
  ChessPiece,
  Coordinate,
  isEqCoordinate,
} from "@/components/playGame/chessMoveValidator";
import { useToast } from "vue-toastification";
import { ref, computed } from "vue";
import { usePlayerWalletStore } from "@/stores/playerWallet";
import { defineProps, defineEmits } from "vue";

const toast = useToast();
const playerType = ref("white");
const getPlayerPieces = () => whitePieces;
const getOpponentPieces = () => blackPieces;

const props = defineProps({
  whitePieces: {
    type: Array,
    required: true,
  },
  blackPieces: {
    type: Array,
    required: true,
  },
  playerHasPlacedPieces: {
    type: Boolean,
    required: true,
  },
});

let whitePieces = ref<ChessPiece[]>([]);

let blackPieces = ref<ChessPiece[]>([]);

const pieces = computed(() => [...props.whitePieces, ...props.blackPieces]);

let selectedPiece = {} as ChessPiece;

function boardCoordinateRange() {
  return Array.from({ length: 8 }, (_, index) => 8 - index);
}

async function clickPiece(piece: ChessPiece) {
  const store = usePlayerWalletStore();
  console.log(await store.provider.getNetwork());

  // There was a previous piece selected
  if (
    !isObjectEmpty(selectedPiece) &&
    selectedPiece.piecePlayer != piece.piecePlayer &&
    !isEqCoordinate(selectedPiece.pieceCoords, piece.pieceCoords)
  ) {
    // Move piece
    makeMove(piece.pieceCoords.y, piece.pieceCoords.x);
    capturePiece(piece);
  } else {
    selectedPiece = piece;
  }
}

function deselectPiece(piece: ChessPiece) {
  selectedPiece = {} as ChessPiece;
}

function makeMove(row: number, col: number) {
  // No piece has been selected
  if (isObjectEmpty(selectedPiece)) {
    return;
  }

  const targetPos: Coordinate = {
    x: col,
    y: row,
  };

  const isValidMove = ChessMoveValidator.isValidMove(
    selectedPiece,
    selectedPiece.pieceCoords,
    targetPos,
    pieces.value.filter((p) => !p.isDead).map((p) => p.pieceCoords)
  );

  if (isValidMove) {
    toast("Move made! Creating zkProof for move now");
  } else {
    toast.error("Invalid move. Play again");
    selectedPiece = {} as ChessPiece;
    return;
  }

  const piece = pieces.value.filter(
    (p) => p.pieceCoords === selectedPiece.pieceCoords
  )[0];

  piece.pieceCoords = targetPos;

  selectedPiece = {} as ChessPiece;
}

function isObjectEmpty(obj: Object) {
  return Object.keys(obj).length == 0;
}

function capturePiece(piece: ChessPiece) {
  piece.isDead = true;
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";
#wrap {
  margin: 3rem 10%;
}

#chess-board {
  border: 0.2rem double $muted-charcoal-ui;
}

#chess-pieces {
  width: 100%;
  height: auto;
  z-index: 10;
}
</style>
