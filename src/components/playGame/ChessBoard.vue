<template>
  <div id="container">
    <center>
      <div id="chess">
        <div id="wrap">
          <!-- Player White Panel -->
          <div id="white-panel" class="chess-panel white">
            <div class="chess-panel-header">
              <h2>White</h2>
            </div>
            <div class="taken-pieces"></div>
          </div>

          <!-- Chess Board -->
          <table id="chess-board">
            <tr class="row" v-for="row in 8" :key="row">
              <td
                class="col chess-square"
                v-for="col in 8"
                :key="col"
                :class="{
                  white: (row + col) % 2 == 0,
                  black: (row + col) % 2 == 1,
                }"
                :data-row="row"
                :data-col="col"
              >
                <span class="is-white"><i class="fa fa-question"></i></span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Player Black Panel -->
        <div id="black-panel" class="chess-panel black">
          <div class="chess-panel-header">
            <h2 class="white-text">Black</h2>
          </div>
          <div class="taken-pieces"></div>
        </div>
      </div>
    </center>
  </div>
</template>

<script setup>
import ChessSquare from "@/components/playGame/ChessSquare.vue";

const board = Array(8)
  .fill()
  .map(() => Array(8).fill(null)); // Create an 8x8 board filled with null
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";
#chess-board {
  width: 100%;
  border: 3px solid $graphite-gray-ui;
}

</style>

<!-- <style scoped lang="scss">
@import "src/assets/styles/_variables.scss";
* {
  transition: all 0.2s linear !important;
}

#chess {
  width: 100%;
  height: 100%;
  display: block;
  background: #eee;
  margin: 0;
  padding: 0;
  overflow: overlay;
}

#wrap {
  display: block;
  margin: 1rem auto;
  max-width: 90%;
  width: 600px;
  padding: 1rem;
}

#chess-board {
  border: solid 3px black;
  background: #eee;
  display: inline-flex;
  flex-wrap: wrap;
}

.square {
  width: 75px;
  height: 75px;
  margin: 0;
  padding: 0;
  border: 0;
  max-width: 12.5%;
  text-align: center;
  display: inline-block;
}

.square.white,
.chess-piece i.black {
  background: white;
}
.square.black,
.chess-piece i.white {
  background: black;
}

.chess-piece i.black {
  color: black !important;
  border: solid 1px black;
}
.chess-piece i.white {
  color: white !important;
  border: solid 1px white;
}

.chess-piece i {
  padding: 1rem;
  font-size: 1.5rem;
  margin-top: 0.5rem;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  max-width: 90%;
}

.square.piece-selected {
  background-color: yellow !important;
}

.square.square-selected {
  background: orange !important;
}

.square.capturable-selected {
  background: red !important;
}

.chess-panel {
  padding: 0.5rem;
  margin: 1rem auto;
}
.chess-panel-header {
  text-align: center;
}
.chess-panel.white {
  background: white;
}
.chess-panel.black {
  background: black;
}
.white-text {
  color: white;
}
.taken-pieces {
  padding: 0.5rem;
}
.chess-panel.white .taken-pieces {
  border: solid 1px black;
}
.chess-panel.black .taken-pieces {
  border: solid 1px white;
}

@media screen and (max-width: 1024px) {
  .chess-piece i {
    margin-top: 0.5rem;
    width: 15px;
    height: 15px;
    padding: 0.3rem;
    line-height: 0.5;
  }
  .square {
    height: 80px;
    width: 80px;
  }
}
</style> -->
