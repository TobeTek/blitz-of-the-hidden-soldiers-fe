<template>
  <span
    class="chess-piece"
    ref="chessPiece"
    @click="toggleSelection"
    v-click-outside="() => (isSelected = false)"
    :class="{ 'is-selected': isSelected }"
  >
    <i :class="`fa ${iconClass()}`"></i>
  </span>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, defineEmits } from "vue";

import {
  ChessPiece,
  Coordinate,
  ChessPiecePlayer,
  PieceClassToType,
} from "@/types";
import { PieceClass } from "@/types/pieces";
import * as _ from "lodash";

const emit = defineEmits(["piece-selected", "piece-deselected"]);
const chessPiece = ref(null);
const isSelected = ref(false);

const props = defineProps({
  piece: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  const piece = props.piece as ChessPiece;
  const OFFSET = 4;
  let transformX = (Number(piece.pieceCoords.x) - 1) * OFFSET + 0.2;
  let transformY = (8 - Number(piece.pieceCoords.y)) * OFFSET - 0.2;
  chessPiece.value.style.transform = `translate(${transformX}rem, ${transformY}rem)`;
});

function iconClass() {
  const pieceClass = _.toLower(PieceClass[props.piece.pieceClass].toString());
  return `fa-chess-${pieceClass} ${props.piece.piecePlayer}`;
}
function toggleSelection() {
  return isSelected.value ? deselectPiece() : selectPiece();
}

function selectPiece() {
  isSelected.value = true;
  emit("piece-selected", props.piece);
}

function deselectPiece() {
  isSelected.value = false;
  emit("piece-deselected", props.piece);
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";
.chess-piece {
  position: absolute;
  display: inline-block;
  height: auto;
  width: 4rem;
  font-size: 3rem;

  &.is-selected {
    background: rgba($color: $light-purple-ui, $alpha: 1);
  }

  i {
    width: inherit;
    text-align: center;

    &.white {
      color: white;
    }
    &.black {
      color: $dark-charcoal-ui;
    }
  }
}
</style>
