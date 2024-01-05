<template>
  <div class="columns is-justify-content-flex-end" v-if="!walletStore.loading">
    <div class="column is-2 is-mobile">
      <Sidebar></Sidebar>
    </div>
    <div class="column">
      <section>
        <ChessBoard
          v-if="playerHasPlacedPieces"
          :playerHasPlacedPieces="playerHasPlacedPieces"
          :opponentHasPlacedPieces="opponentHasPlacedPieces"
          :whitePieces="whitePieces"
          :blackPieces="blackPieces"
        ></ChessBoard>
        <SelectPiecePositions
          v-else
          :gameAddress="gameAddress"
          :playerAddress="walletStore.walletAddress"
          @positions-selected="postSetPositions"
        ></SelectPiecePositions>
      </section>
    </div>
    <div v-if="playerHasPlacedPieces" class="column is-2" id="player-info">
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
import { ref, nextTick, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import CapturedPieces from "@/components/playGame/CapturedPieces.vue";
import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import SelectPiecePositions from "@/components/playGame/SelectPiecePositions.vue";

import { useChessGameStore } from "@/stores/chessGame";
import { ChessGameContract } from "@/ethContracts/chessGame";
import { EthChessPiece } from "@/types";

const walletStore = usePlayerWalletStore() as PlayerWalletStore;
const gameStore = useChessGameStore();
const router = useRouter();
const route = useRoute();
const playerHasPlacedPieces = ref(false);
const opponentHasPlacedPieces = ref(false);
const opponentAddress = ref();

const gameAddress = route.params.gameAddress;
const whitePieces = reactive<EthChessPiece[]>([]);
const blackPieces = reactive<EthChessPiece[]>([]);

let chessGameInstance: ChessGameContract;

onMounted(() => {
  // fetchGame(route.params.gameAddress);
});

watch(
  () => route.params.gameAddress,
  async (newGameAddress, oldGameAddress) => {
    await fetchGame(newGameAddress);
  }
);

watch(
  () => walletStore.loading,
  async (isLoading: boolean) => {
    if (!isLoading) {
      await fetchGame(route.params.gameAddress);
    }
  }
);

async function fetchGame(gameAddress: string) {
  console.log("Fetching Game:", gameAddress);
  chessGameInstance = await ChessGameContract.buildInstance(gameAddress);
  opponentAddress.value = deteremineOpponentAddress(
    walletStore.walletAddress,
    chessGameInstance._playerWhite,
    chessGameInstance._playerBlack
  );
  playerHasPlacedPieces.value =
    await chessGameInstance.getPlayerHasPlacedPieces(walletStore.walletAddress);
  opponentHasPlacedPieces.value =
    await chessGameInstance.getPlayerHasPlacedPieces(opponentAddress.value);

  const result = await chessGameInstance.getAllPieces();
  console.log("Pieces: ", result);
  whitePieces.push(...result.white);
  blackPieces.push(...result.black);
}

function deteremineOpponentAddress(
  playerAddress: string,
  playerWhite: string,
  playerBlack: string
) {
  if (playerAddress === playerWhite) {
    return playerBlack;
  } else {
    return playerWhite;
  }
}

function postSetPositions() {
  playerHasPlacedPieces.value = true;
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.columns {
  width: 100vw;
}
</style>
