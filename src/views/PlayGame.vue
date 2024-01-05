<template>
  <div class="columns is-justify-content-flex-end" v-if="!walletStore.loading">
    <div class="column is-2 is-mobile">
      <Sidebar></Sidebar>
    </div>
    <div class="column">
      <section>
        <ChessBoard v-if="piecesSet"></ChessBoard>
        <SelectPiecePositions v-else></SelectPiecePositions>
      </section>
    </div>
    <div v-if="piecesSet" class="column is-2" id="player-info">
      <CapturedPieces></CapturedPieces>
    </div>
  </div>
  <MobileNotSupportedVue></MobileNotSupportedVue>
  <PreloadSpinner :isLoading="walletStore.loading" />
</template>

<script setup lang="ts">
import UserOverview from "@/components/gameOverview/UserOverview.vue";
import PieceCollections from "@/components/gameOverview/PieceCollections.vue";
import PreloadSpinner from "@/components/common/PreloadSpinner.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import MobileNotSupportedVue from "@/components/common/MobileNotSupported.vue";
import ChessBoard from "@/components/playGame/ChessBoard.vue";
import { ref, nextTick, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import CapturedPieces from "@/components/playGame/CapturedPieces.vue";
import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import SelectPiecePositions from "@/components/playGame/SelectPiecePositions.vue";

import { useChessGameStore} from "@/stores/chessGame";
import { ChessGameContract } from "@/ethContracts/chessGame";

const walletStore = usePlayerWalletStore() as PlayerWalletStore;
const gameStore = useChessGameStore();
const router = useRouter();
const route = useRoute();
const piecesSet = ref(false);

let chessGame: ChessGameContract;

onMounted(() => {
  fetchGame(route.params.gameAddress);
});

watch(
  () => route.params.gameAddress,
  async (newGameAddress, oldGameAddress) => {
    await fetchGame(newGameAddress);
  }
);

async function fetchGame(gameAddress: string) {
  // Fetch game information
  // Load pieces
  // Load captured pieces
  console.log('Fetching Game:', gameAddress);
  chessGame = new ChessGameContract(gameAddress);
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";


.columns {
  width: 100vw;
}
</style>
