<template>
  <div id="container" class="table-container">
    <table v-if="props.games.length" class="table is-fullwidth is-dark" id="game-list">
      <thead class="table-header">
        <th>#</th>
        <th>Game Address</th>
        <th>Opponent</th>
        <th class="has-text-centered">Status</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="(game, indx) in props.games" :key="game.gameAddress">
          <td>{{ indx + 1 }}</td>
          <td>{{ fmtShortAddress(game.gameAddress) }}</td>
          <td>{{ fmtShortAddress(game.opponentAddress) }}</td>
          <td class="has-text-centered">
            <span class="tag is-dark">In Progress</span>
          </td>
          <td>
            <button class="button is-small is-text view-more">
              >>>
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
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <small v-if="!props.games.length">You don't have any games yet. Create one!</small>
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

.view-more {
  color: $white-ui;
  animation: button-anim 2s infinite;

  &:hover {
    text-decoration: none;
  }

  &:focus-within > .game-option-menu {
    display: inline-block;
  }

  .game-option-menu {
    display: none;
    position: absolute;
    top: inherit;

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
}

#more-info {
  display: inline-block;
  padding-top: 20px;
}

table {
  // display: block;
  width: 100%;
  
  // overflow-x: hidden;
}
</style>
