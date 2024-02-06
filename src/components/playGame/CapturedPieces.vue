<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-vertical">
      <div class="tile pt-3 is-child">
        <div class="box" id="player-white-box">
          <p class="has-text-centered">Player White</p>
          <p class="has-text-centered"><i>0x21...192</i></p>
          <hr />
          <div>Captured:</div>
          <div>
            <span class="chess-piece black"
              ><i class="fa fa-chess-pawn"></i
            ></span>
            <span class="chess-piece black"
              ><i class="fa fa-chess-pawn"></i
            ></span>
            <span class="chess-piece black"
              ><i class="fa fa-chess-knight"></i
            ></span>
            <span class="chess-piece black"
              ><i class="fa fa-chess-king"></i
            ></span>
          </div>
        </div>
      </div>
      <div class="tile is-child">
        <div class="box" id="player-black-box">
          <p class="has-text-centered">Player Black</p>
          <p class="has-text-centered"><i>0x00...ff0</i></p>
          <hr />
          <div>Captured:</div>
          <div>
            <span class="chess-piece white"
              ><i class="fa fa-chess-pawn"></i
            ></span>
            <span class="chess-piece white"
              ><i class="fa fa-chess-pawn"></i
            ></span>
            <span class="chess-piece white"
              ><i class="fa fa-chess-knight"></i
            ></span>
            <span class="chess-piece white"
              ><i class="fa fa-chess-king"></i
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

#player-info {
  margin-right: 0.2rem;
}

.box {
  width: 100%;
  margin: 0 auto;

  border-radius: 15px;

  hr {
    margin: 0.5rem auto;
  }

  &#player-white-box {
    background-color: $muted-charcoal-ui;
    border: 1.5px solid $dark-charcoal-ui;
    color: $white-ui;

    hr {
      background-color: $midnight-blue-ui;
    }
  }

  &#player-black-box {
    color: $white-ui;
    background-color: $graphite-gray-ui;
    border: 1.5px solid $charcoal-gray-ui;
  }
}

.chess-piece {
  display: inline-block;
  width: fit-content;
  margin: 0 0.35rem;
  text-align: center;

  &.white {
    color: white;
  }
  &.black {
    color: $dark-charcoal-ui;
  }
}
</style>
