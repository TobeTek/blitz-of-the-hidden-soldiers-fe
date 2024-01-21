<template>
  <div id="container" class="table-container">
    <table
      v-if="props.games.length"
      class="table is-fullwidth is-dark"
      id="game-list"
    >
      <thead class="table-header">
        <th>#</th>
        <th>Game Address</th>
        <th>Opponent</th>
        <th class="has-text-centered">Status</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="(game, indx) in props.games" :key="game.gameAddress">
          <td>
            <div>
              <span>{{ indx + 1 }}</span>
              <span
                class="tag player-type"
                :class="{
                  'is-white': game.isPlayingAsWhite,
                  'is-black': game.isPlayingAsBlack,
                }"
                >&nbsp;</span
              >
            </div>
          </td>
          <td v-click-to-copy-text="game.gameAddress" class="click-to-copy">
            <div>{{ fmtShortAddress(game.gameAddress) }}</div>
          </td>
          <td v-click-to-copy-text="game.opponentAddress" class="click-to-copy">
            {{ fmtShortAddress(game.opponentAddress) }}
          </td>
          <td class="has-text-centered">
            <span class="tag is-dark">Player Make Move</span>
          </td>
          <td>
            <div class="view-more">
              <button class="button is-small is-text">>>></button>
              <ul class="game-option-menu">
                <li>
                  <button
                    class="button is-success"
                    @click="emit('init-set-pieces', game.gameAddress)"
                  >
                    Set Pieces
                  </button>
                </li>

                <li>
                  <button
                    class="button is-success"
                    @click="$emit('go-to-game', game.gameAddress)"
                  >
                    Go to Game
                  </button>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <small v-if="!props.games.length"
      >You don't have any games yet. Create one!</small
    >
  </div>
  <h4 class="has-text-centered">
    <a href="" class="underlined-link" id="more-info">
      Find out more on the wiki
    </a>
  </h4>
</template>

<script setup lang="ts">
import {
  GameCreatedEvent,
  GameManagerContract,
} from "@/ethContracts/gameManager";
import {
  onMounted,
  reactive,
  ref,
  nextTick,
  defineProps,
  defineEmits,
} from "vue";
import { usePlayerWalletStore, PlayerWalletStore } from "@/stores/playerWallet";
import { fmtShortAddress } from "@/utils";

const props = defineProps({
  games: {
    type: Array<GameCreatedEvent>,
    required: true,
  },
});
const emit = defineEmits(["init-set-pieces", "go-to-game"]);
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.player-type {
  padding: 0.5rem;
  margin: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 202020px;
}

.view-more {
  max-width: 5rem;
  button {
    color: $white-ui;
    animation: button-anim 2s infinite;

    &:hover {
      text-decoration: none;
    }
  }

  &:focus-within > .game-option-menu {
    display: block;
  }

  .game-option-menu {
    display: none;
    position: relative;
    top: inherit;
    left: -5rem;

    button {
      background-color: $bright-gray-ui;
      margin: 0.2rem;
    }
  }
}

#container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 60vh;
  overflow-y: scroll;
}

#game-list {
  background-color: inherit;
  color: $white-ui;
  transition: color 0.2s ease-in;

  th {
    color: $white-ui;
  }

  tr:hover {
    color: $bright-gray-ui;
  }
  td:hover.click-to-copy {
    color: $charcoal-gray-ui;
    cursor: pointer;
  }
}

#more-info {
  display: block;
  padding: 2rem;
}

table {
  // display: block;
  width: 100%;
  padding-bottom: 5rem;
  // overflow-x: hidden;
}
</style>
