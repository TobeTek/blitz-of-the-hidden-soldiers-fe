<template>
  <div class="columns is-justify-content-flex-end" v-if="!walletStore.loading">
    <div class="column is-2 is-mobile">
      <Sidebar></Sidebar>
    </div>
    <div class="column is-mobile" id="main">
      <UserOverview
        @start-create-game="() => (isCreateGameModalActive = true)"
        @go-to-game="goToGame($event)"
        @init-set-pieces="initSetPieces($event)"
        @post-create-game="getPlayerGames"
        :games="playerGames"
      ></UserOverview>
      <br />
      <hr />
      <MyPieces></MyPieces>
      <br />
      <PieceCollections></PieceCollections>
    </div>
  </div>

  <CreateGameModal
    :class="{ 'is-active': isCreateGameModalActive }"
    @close="() => (isCreateGameModalActive = false)"
    @post-create-game="postCreateGame"
  ></CreateGameModal>
  <SelectPieces
    :class="{ 'is-active': isSelectPiecesModalActive }"
    :gameAddress="gameToEdit.gameAddress"
    @close="() => (isSelectPiecesModalActive = false)"
    @pieces-selected="postSetPieces"
  >
  </SelectPieces>
  <PreloadSpinner :isLoading="walletStore.loading" />
  <MobileNotSupported></MobileNotSupported>
</template>

<script setup lang="ts">
import MobileNotSupported from "@/components/common/MobileNotSupported.vue";
import PreloadSpinner from "@/components/common/PreloadSpinner.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import CreateGameModal from "@/components/composition/CreateGameModal.vue";
import SelectPieces from "@/components/composition/SelectPieces.vue";
import MyPieces from "@/components/gameOverview/MyPieces.vue";
import PieceCollections from "@/components/gameOverview/PieceCollections.vue";
import UserOverview from "@/components/gameOverview/UserOverview.vue";
import {
  GameCreatedEvent,
  GameManagerContract,
} from "@/ethContracts/gameManager";
import router from "@/router";
import { useChessGameStore } from "@/stores/chessGame";
import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import { ethers } from "ethers";
import { onMounted, ref } from "vue";

const isCreateGameModalActive = ref(false);
const isSelectPiecesModalActive = ref(false);
const walletStore = usePlayerWalletStore() as PlayerWalletStore;
const gameStore = useChessGameStore();

const playerGames = ref<GameCreatedEvent[]>([]);
let gameToEdit = {
  gameAddress: ethers.ZeroAddress,
} as GameCreatedEvent;

onMounted(() => {
  listenForEvents().catch();
  getPlayerGames().catch();
});

function initSetPieces(gameAddress: string) {
  const game = playerGames.value.filter(
    (g) => g.gameAddress === gameAddress
  )[0];
  gameToEdit = game;
  isSelectPiecesModalActive.value = true;
}

function goToGame(gameAddress: string) {
  router.push({ name: "PlayGame", params: { gameAddress: gameAddress } });
}

async function listenForEvents() {
  let gameManager = await GameManagerContract.getInstance();
  const filter = gameManager.filters.GameCreated(null, null, null);
  gameManager.on(filter, async (args: any[]) => {
    console.log("Event: ", args);
    await getPlayerGames();
  });
}

async function getPlayerGames() {
  const games = await GameManagerContract.getPlayersGames(
    walletStore.walletAddress
  );
  playerGames.value = games;
}

async function postCreateGame() {
  isCreateGameModalActive.value = false;
  await getPlayerGames();
}

async function postSetPieces() {}
</script>

<style scoped lang="scss">
.columns {
  width: 100vw;
}
</style>
