<template>
  <span
  class="chess-piece" ref="chessPiece"
  @click="toggleSelection"
  v-click-outside="() => (isSelected = false)"
  :class="{'is-selected': isSelected}"
  >
    <i :class="`fa ${iconClass()}`"></i>
  </span>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, defineEmits } from "vue";

type Coordinate = {
  x: number;
  y: number;
};

type ChessPiece = {
  pieceId: string | null;
  pieceType: string;
  piecePlayer: "white" | "black";
  position: Coordinate;
};

const emit = defineEmits(['piece-selected', 'piece-deselected'])
const chessPiece = ref(null);
const isSelected = ref(false);

const props = defineProps({
  piece: {
    type: Object,
  },
});

onMounted(() => {
  const piece = props.piece as ChessPiece;

  const OFFSET = 4;
  let transformX = (piece.position.x - 1) * OFFSET + 0.2;
  let transformY = (8 - piece.position.y) * OFFSET - 0.2;
  chessPiece.value.style.transform = `translate(${transformX}rem, ${transformY}rem)`;
});

function iconClass(){
  return `fa-chess-${props.piece.pieceType} ${props.piece.piecePlayer}`;
};
function toggleSelection (){
  return isSelected.value ? deselectPiece() : selectPiece();
}

function selectPiece(){
  isSelected.value = true;
  emit('piece-selected', props.piece);
}

function deselectPiece(){
  isSelected.value = false;
  emit('piece-deselected', props.piece);
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

  &.is-selected{
    background: rgba($color: $light-purple-ui, $alpha: 1.0);
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
