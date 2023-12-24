<template>
  <td
    class="col chess-square"
    :class="{
      white: playerType == 'white',
      black: playerType == 'black',
    }"
    :data-row="row"
    :data-col="col"
  >
    <span class="chess-piece"><i class="fa fa-question"></i></span>
  </td>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  pieceClass: {
    type: String,
    required: true,
  },
  playerType: {
    type: String,
    required: true,
  },
  row:{
    type: Number,
    required: true,
  },
  col: {
    type: Number,
    required: true
  }
});
</script>

<style scoped lang="scss">
.chess-square {
  margin: 0;
  padding: 0;
  height: 4rem;
  width: 2rem;
  transition: background-color 0.2s ease-in-out;

  .white {
    background-color: #e5c063;

    &:hover {
      background-color: #f0ba31;
    }
  }

  .black {
    background-color: black;

    &:hover {
      background-color: rgb(18, 17, 17);
    }
  }
}

.chess-piece {
  font-size: 3rem;
  padding: 0.2rem;
  text-align: center;
  display: inline-block;
  width: 100%;

  .white {
    color: white;
  }

  .black {
    color: black;
  }
}
</style>
