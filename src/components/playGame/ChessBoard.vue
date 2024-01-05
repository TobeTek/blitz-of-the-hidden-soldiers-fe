<template>
  <div id="wrap">
    <div id="chess-pieces">
      <template v-for="piece in pieces" :key="piece.position">
        <ChessPieceComponent
          v-if="!piece.isCaptured"
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
  playerPieces: {
    type: Array,
    required: true,
  },
  opponentPieces: {
    type: Array,
    required: true,
  },
  playerHasPlacedPieces: {
    type: Boolean,
    required: true,
  },
});

let whitePieces = ref<ChessPiece[]>([
  {
    pieceType: "pawn",
    piecePlayer: "black",
    position: { x: 1, y: 1 },
    isCaptured: false,
  },
  {
    pieceType: "queen",
    piecePlayer: "black",
    position: { x: 3, y: 2 },
    isCaptured: false,
  },
  {
    pieceType: "king",
    piecePlayer: "black",
    position: { x: 3, y: 7 },
    isCaptured: false,
  },
]);

let blackPieces = ref<ChessPiece[]>([
  {
    pieceType: "pawn",
    piecePlayer: "white",
    position: { x: 1, y: 2 },
    isCaptured: false,
  },
  {
    pieceType: "knight",
    piecePlayer: "white",
    position: { x: 4, y: 5 },
    isCaptured: false,
  },
  {
    pieceType: "bishop",
    piecePlayer: "white",
    position: { x: 7, y: 5 },
    isCaptured: false,
  },
]);

const pieces = computed(() => [...whitePieces.value, ...blackPieces.value]);

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
    !isEqCoordinate(selectedPiece.position, piece.position)
  ) {
    // Move piece
    makeMove(piece.position.y, piece.position.x);
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
    selectedPiece.position,
    targetPos,
    pieces.value.filter((p) => !p.isCaptured).map((p) => p.position)
  );

  if (isValidMove) {
    toast("Move made! Creating zkProof for move now");
  } else {
    toast.error("Invalid move. Play again");
    selectedPiece = {} as ChessPiece;
    return;
  }

  const piece = pieces.value.filter(
    (p) => p.position === selectedPiece.position
  )[0];

  piece.position = targetPos;

  selectedPiece = {} as ChessPiece;
}

function isObjectEmpty(obj: Object) {
  return Object.keys(obj).length == 0;
}

function capturePiece(piece: ChessPiece) {
  piece.isCaptured = true;
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
  // position: fixed;
  // bottom: 0;
  // left: 0;
  width: 100%;
  height: auto;
  z-index: 10;
}
</style>
