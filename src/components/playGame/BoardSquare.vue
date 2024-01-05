<template>
  <td
    class="col chess-square drop-zone"
    :class="getSquareClass()"
    :data-row="row"
    :data-col="col"
  >
    <span class="coordinate">{{ getSquareCoordinate() }}</span>
  </td>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";

const props = defineProps({
  isSquareVisible: {
    type: Boolean,
    default: false,
  },
  row: {
    type: Number,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  },
});

const getSquareClass = () => {
  return (props.row + props.col) % 2 == 1 ? "white" : "black";
};

function getSquareCoordinate() {
  return `${String.fromCharCode(64 + props.col)}${props.row}`;
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";
.chess-square {
  margin: 0;
  padding: 0;
  height: 4rem;
  width: 4rem;
  transition: background-color 0.2s ease-in-out;

  &.white {
    background-color: #e5c063;

    &:hover {
      background-color: #f0ba31;
    }
  }

  &.black {
    background-color: black;

    &:hover {
      background-color: rgb(18, 17, 17);
    }
  }

  .coordinate {
    display: inline-block;
    width: inherit;
    padding-left: 0.1rem;
    font-size: small;
    color: white;
    opacity: 0.5;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    .coordinate {
      opacity: 1;
    }
  }
}
</style>
