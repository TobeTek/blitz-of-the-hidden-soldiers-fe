<template>
  <div class="tile is-mobile is-parent">
    <div class="tile is-mobile is-child">
      <div id="my-pieces">
        <h1 class="title">My Pieces</h1>

        <div id="container" class="table-container">
          <table class="table is-fullwidth is-dark" id="game-list">
            <thead class="table-header">
              <th>#</th>
              <th>Name</th>
              <th>Token ID</th>
              <th>Piece Class</th>
              <th class="has-text-centered">Description</th>
              <th></th>
            </thead>
            <tbody>
              <tr v-for="(token, indx) in playerTokens" :key="token.tokenId">
                <td>{{ indx + 1 }}</td>
                <td
                  v-click-to-copy-text="getTokenName(token.tokenId)"
                  class="click-to-copy"
                >
                  {{ getTokenName(token.tokenId) }}
                </td>
                <td v-click-to-copy-text="token.tokenId" class="click-to-copy">
                  <i>{{ token.tokenId }}</i>
                </td>
                <td>
                  <span
                    class="tag"
                    :class="{
                      'is-legendary': !token.properties.isDefaultPiece,
                      'is-outline': token.properties.isDefaultPiece,
                    }"
                    ><b>{{
                      getTokenClass(token.properties.pieceClass)
                    }}</b></span
                  >
                </td>
                <td class="description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                  vero doloribus aliquid! Vel, minus?
                </td>
                <td>
                  <button class="button is-small is-text view-more">>>></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { ChessPiece, ChessPieceTypes } from "@/types/index";
import { TOKEN_NAMES_FROM_ID, PieceClass } from "@/types/pieces";
import * as _ from "lodash";

const props = defineProps({
  playerTokens: { type: Array, required: true },
});

function getTokenName(tokenId: number | string) {
  const tokenName = TOKEN_NAMES_FROM_ID.get(tokenId.toString()) ?? "??";
  return _.startCase(_.toLower(tokenName.replace("_", " ")));
}

function getTokenClass(tokenClass: number) {
  return _.startCase(_.toLower(PieceClass[tokenClass]));
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.is-legendary {
  color: $white-ui;
  background-color: $deep-plum-ui;
}

.title {
  color: $white-ui;
  text-align: center;
}

#my-pieces {
  padding: 0 1rem;
  // background-color: $dark-charcoal-ui;
}

.view-more {
  color: $white-ui;

  &:hover {
    text-decoration: none;
  }
}

#container {
  display: flex;
  align-items: center;
  justify-content: center;
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
  display: inline-block;
  padding-top: 20px;
}
</style>
