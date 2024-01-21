<template>
  <div class="columns is-justify-content-flex-end" v-if="!isLoading">
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
          :playerType="playerType"
        ></ChessBoard>
        <SelectPiecePositions
          v-else
          :gameAddress="gameAddress"
          :playerAddress="walletStore.walletAddress"
          @positions-selected="postSetPositions"
        ></SelectPiecePositions>
        <!-- TODO: Implement -->
        <!-- <WaitingForOpponentToSelectPieces></WaitingForOpponentToSelectPieces> -->
      </section>
    </div>
    <div v-if="playerHasPlacedPieces" class="column is-2" id="player-info">
      <CapturedPieces></CapturedPieces>
    </div>
  </div>
  <MobileNotSupportedVue></MobileNotSupportedVue>
  <PreloadSpinner :isLoading="isLoading" />
</template>

<script setup lang="ts">
import PreloadSpinner from "@/components/common/PreloadSpinner.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import MobileNotSupportedVue from "@/components/common/MobileNotSupported.vue";
import ChessBoard from "@/components/playGame/ChessBoard.vue";
import { ref, onMounted, watch, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import CapturedPieces from "@/components/playGame/CapturedPieces.vue";
import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import SelectPiecePositions from "@/components/playGame/SelectPiecePositions.vue";

import { useChessGameStore } from "@/stores/chessGame";
import { ChessGameContract } from "@/ethContracts/chessGame";
import { EthChessPiece, ChessPiecePlayer, BoardChessPiece } from "@/types";
import {
  retrieveGamePieces,
  persistGamePieces,
} from "@/utils/piecePersistence";

const walletStore = usePlayerWalletStore() as PlayerWalletStore;
const gameStore = useChessGameStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(true);

const playerHasPlacedPieces = ref(false);
const opponentHasPlacedPieces = ref(false);
const opponentAddress = ref<string>();

const playerType = ref<ChessPiecePlayer>();
const opponentType = ref<ChessPiecePlayer>();

const gameAddress = route.params.gameAddress;
const ethWhitePieces = reactive<EthChessPiece[]>([]);
const ethBlackPieces = reactive<EthChessPiece[]>([]);

const whitePieces = reactive<BoardChessPiece[]>([]);
const blackPieces = reactive<BoardChessPiece[]>([]);

let chessGameInstance: ChessGameContract;

onMounted(() => {
  if(walletStore.loading === false){
    isLoading.value = false;
    const f = async () => {await fetchGame(route.params.gameAddress)}
    f().catch();
  }

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
  isLoading.value = true;
  chessGameInstance = await ChessGameContract.buildInstance(gameAddress);
  opponentAddress.value = chessGameInstance.getOpponentAddress(
    walletStore.walletAddress
  );
  playerHasPlacedPieces.value =
    await chessGameInstance.getPlayerHasPlacedPieces(walletStore.walletAddress);
  opponentHasPlacedPieces.value =
    await chessGameInstance.getPlayerHasPlacedPieces(opponentAddress.value);
  playerType.value = await chessGameInstance.getPlayerType(
    walletStore.walletAddress
  );
  opponentType.value =
    playerType.value === ChessPiecePlayer.WHITE
      ? ChessPiecePlayer.BLACK
      : ChessPiecePlayer.WHITE;
  const result = await chessGameInstance.getAllPieces();
  ethWhitePieces.push(...result.white);
  ethBlackPieces.push(...result.black);

  retrievePersistedPlayerPieces();
  isLoading.value = false;
}

async function retrievePersistedPlayerPieces() {
  const persistedWhitePieces = await retrieveGamePieces({
    playerAddress: walletStore.walletAddress,
    playerType: ChessPiecePlayer.WHITE,
    gameAddress,
  });
  updatePersistedPieces(persistedWhitePieces, ethWhitePieces);
  whitePieces.push(...persistedWhitePieces.values());

  const persistedBlackPieces = await retrieveGamePieces({
    playerAddress: walletStore.walletAddress,
    playerType: ChessPiecePlayer.BLACK,
    gameAddress,
  });
  updatePersistedPieces(persistedBlackPieces, ethBlackPieces);
  blackPieces.push(...persistedBlackPieces.values());
}

function postSetPositions() {
  playerHasPlacedPieces.value = true;
}

function updatePersistedPieces(
  persistedPieces: Map<string, BoardChessPiece>,
  ethPieces: EthChessPiece[]
) {
  for (const ethPiece of ethPieces) {
    const persistedPiece = persistedPieces.get(ethPiece.pieceId) ?? {
      piecePlayer: playerType.value,
    };
    if (
      persistedPiece.updatedAt === undefined ||
      persistedPiece?.updatedAt < ethPiece.updatedAt
    ) {
      persistedPieces.set(
        persistedPiece.pieceId,
        Object.assign({}, persistedPiece, ethPiece)
      );
    }
  }
  return persistedPieces;
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.columns {
  width: 100vw;
}
</style>
