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
      <MyPieces :playerTokens="playerTokens"></MyPieces>
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
import { ChessPieceCollectionContract } from "@/ethContracts/chessPieceCollection";
import {
  GameCreatedEvent,
  GameManagerContract,
} from "@/ethContracts/gameManager";
import router from "@/router";
import { useChessGameStore } from "@/stores/chessGame";
import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import { TokenBalance } from "@/types";
import { ethers } from "ethers";
import { onMounted, ref, watch } from "vue";
import {
  retrieveGamePieces,
  persistGamePieces,
} from "@/utils/piecePersistence";
import { ChessPiece, PieceClassToType } from "@/types";
import { PieceClass } from "@/types/pieces";

const walletStore = usePlayerWalletStore() as PlayerWalletStore;
const gameStore = useChessGameStore();

const isCreateGameModalActive = ref(false);
const isSelectPiecesModalActive = ref(false);

const playerGames = ref<GameCreatedEvent[]>([]);
const playerTokens = ref<TokenBalance[]>([]);
let gameToEdit = {
  gameAddress: ethers.ZeroAddress,
} as GameCreatedEvent;

onMounted(()=>{});
watch(
  () => walletStore.loading,
  (isLoading) => {
    if (!isLoading) {
      listenForEvents().catch();
      getPlayerGames().catch();
      getPlayerTokens().catch();
    }
  }
);

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
async function getPlayerTokens() {
  const tokens = await ChessPieceCollectionContract.getPlayerTokens(
    walletStore.walletAddress
  );
  playerTokens.value = tokens;
}

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

async function postCreateGame() {
  isCreateGameModalActive.value = false;
  await getPlayerGames();
}

async function postSetPieces() {
  isSelectPiecesModalActive.value = false;
}
</script>

<style scoped lang="scss">
.columns {
  width: 100vw;
}
</style>
