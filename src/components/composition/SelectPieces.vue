<template>
  <BaseModal>
    <template #modal-content>
      <div class="modal-card">
        <header class="modal-card-head">
          <div>
            <h1>Select your Pieces for the Battle!</h1>

            <h3>Game: {{ fmtShortAddress(props.gameAddress) }}</h3>
            <p class="has-text-centered">
              <small>This action can only be performed once!</small>
            </p>
          </div>
        </header>
        <section class="modal-card-body">
          <div
            v-for="(selection, indx) in pieces"
            :key="indx"
            class="columns is-vcentered"
          >
            <div class="column has-text-left">
              <label class="label">Token ID</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  required
                  :value="selection.tokenId"
                  @model="selection.tokenId"
                />
              </div>
            </div>

            <div class="column has-text-centered">
              <label class="label">Piece Class</label>
              <div class="control">
                <select
                  @model="selection.pieceClass"
                  :value="selection.pieceClass"
                  class="select has-text-centered piece-class"
                  required
                >
                  <option
                    v-for="pieceClass in pieceClassOptions"
                    :key="pieceClass"
                    :value="PieceClass[pieceClass]"
                  >
                    {{ pieceClass }}
                  </option>
                </select>
              </div>
            </div>

            <div class="column has-text-right">
              <label class="label">Count</label>
              <div class="control">
                <input
                  class="input"
                  type="number"
                  @model="selection.count"
                  :value="selection.count"
                  required
                />
              </div>
            </div>
            <div class="column">
              <div class="control">
                <br />
                <button
                  class="button is-small is-outline"
                  @click="removePiece(indx)"
                >
                  <span><i class="fa fa-trash"></i></span>
                </button>
              </div>
            </div>
          </div>

          <div class="control has-text-centered">
            <button class="button is-outline pl-5 pr-5" @click="addPiece">
              <span class="icon"><i class="fa fa-plus"></i></span>
              <span>Add</span>
            </button>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success is-fullwidth"
            @click="selectPieces"
          >
            Save Selection
          </button>
        </footer>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { fmtShortAddress } from "@/utils";
import { defineProps, reactive } from "vue";
import {
  PieceSelection,
  PieceClass,
  KnightTokens,
  BishopTokens,
  RookTokens,
} from "@/types/pieces";
import { ChessPieceTypes, ChessPiece, ChessPiecePlayer } from "@/types";
import BaseModal from "@/components/composition/BaseModal.vue";
import { GameManagerContract } from "@/ethContracts/gameManager";
import { PawnTokens, KingTokens, QueenTokens } from "@/types/pieces";

const pieceClassOptions = Object.keys(PieceClass).filter((x) =>
  Number.isNaN(Number(x))
);
const pieces = reactive<PieceSelection[]>([
  {
    tokenId: KingTokens.STANDARD_KING,
    pieceClass: PieceClass.KING,
    count: 1,
  },
  {
    tokenId: QueenTokens.STANDARD_QUEEN,
    pieceClass: PieceClass.QUEEN,
    count: 1,
  },
  {
    tokenId: KnightTokens.STANDARD_KNIGHT,
    pieceClass: PieceClass.KNIGHT,
    count: 1,
  },
  {
    tokenId: BishopTokens.STANDARD_BISHOP,
    pieceClass: PieceClass.BISHOP,
    count: 1,
  },
  {
    tokenId: RookTokens.STANDARD_ROOK,
    pieceClass: PieceClass.ROOK,
    count: 1,
  },
  {
    tokenId: PawnTokens.STANDARD_PAWN,
    pieceClass: PieceClass.PAWN,
    count: 5,
  },
]);
const props = defineProps({
  gameAddress: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["pieces-selected"]);

function addPiece() {
  pieces.push({
    pieceClass: PieceClass.PAWN,
    tokenId: 1,
    count: 0,
  });
}

function removePiece(index: number) {
  pieces.splice(index, 1);
}

async function selectPieces() {
  
    await GameManagerContract.setAllocationForGame(props.gameAddress, pieces);
    emit('pieces-selected', pieces);
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.modal-card {
  border-radius: 20px;
  background-color: $graphite-gray-ui;
  * {
    background-color: inherit;

    color: $white-ui;
  }

  .modal-card-head {
    background-color: $midnight-black-ui;
  }

  input,
  .icon,
  select,
  option {
    background-color: $dark-charcoal-ui;
  }
}

select.piece-class {
  font-weight: bold;
  width: 100%;
  border-radius: 5px;
  height: 2.5rem;
}
</style>
