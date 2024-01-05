<template>
  <BaseModal>
    <template #modal-content>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title has-text-centered">
            Play against an Opponent
          </p>
        </header>
        <section class="modal-card-body">
          <label class="label">Opponent Address: </label>
          <div class="field has-addons">
            <br />
            <div class="control is-expanded">
              <input
                class="input"
                type="text"
                placeholder="0x00...123"
                v-model="opponentAddress"
                required
              />
            </div>
            <div class="control">
              <button class="button is-outline" @click="pasteFromClipboard">
                <span class="icon"><i class="fa fa-clipboard"></i></span>
                <span>Paste</span>
              </button>
            </div>
          </div>

          <div class="field">
            <div class="control has-text-centered">
              <label class="radio is-large p-2">
                <input
                  type="radio"
                  name="question"
                  :value="ChessPiecePlayer.WHITE"
                  v-model="playerType"
                />
                Play as white
              </label>
              <label class="radio is-large p-2">
                <input
                  type="radio"
                  name="question"
                  :value="ChessPiecePlayer.BLACK"
                  v-model="playerType"
                />
                Play as black
              </label>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success is-fullwidth"
            @click="initCreateGame()"
          >
            Create Game
          </button>
        </footer>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import {
  getFirestore,
  getDoc,
  getDocs,
  query,
  where,
  collection,
  doc,
} from "firebase/firestore";
import BaseModal from "@/components/composition/BaseModal.vue";
import firebase from "@/firebaseInit";
import { inject, provide, ref, reactive } from "vue";
import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import { Contract, ethers } from "ethers";
import { useToast } from "vue-toastification";
import { GameManagerContract } from "@/ethContracts/gameManager";
import { ChessPieceTypes, ChessPiecePlayer, isValidAddress } from "@/types";

const toast = useToast();
const store = usePlayerWalletStore() as PlayerWalletStore;
const opponentAddress = ref("");
const playerType = ref<ChessPiecePlayer>(ChessPiecePlayer.WHITE);

const emit = defineEmits([
  "post-create-game"
]);

async function pasteFromClipboard() {
  if (navigator.clipboard) {
    try {
      const clipboardText = await navigator.clipboard.readText();
      opponentAddress.value = clipboardText;
    } catch (error: any) {
      toast.error("Failed to read clipboard contents: ", error);
    }
  } else {
    toast.error("Clipboard API not supported in this browser.");
  }
}

async function initCreateGame() {
  try {
    const { value: opponent } = opponentAddress;

    if (!isValidAddress(opponent)) {
      toast.error("Invalid opponent address");
      return;
    }

    const playerWhite =
      playerType.value === ChessPiecePlayer.WHITE
        ? store.walletAddress
        : opponent;
    const playerBlack =
      playerType.value === ChessPiecePlayer.BLACK
        ? store.walletAddress
        : opponent;

    await GameManagerContract.createNewGame(playerWhite, playerBlack);
  } catch (error: any) {
    toast.error(error.message);
  }
  emit('post-create-game'); 
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
    background-color: $bright-gray-ui;
  }
}
</style>
