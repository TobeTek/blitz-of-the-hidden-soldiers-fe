<template>
  <div class="columns is-justify-content-flex-end">
    <div class="column is-2 is-mobile">
      <Sidebar></Sidebar>
    </div>
    <div class="column is-mobile" id="main">
      <UserOverview
        @start-create-game="() => (isCreateGameModalActive = true)"
      ></UserOverview>
      <br />
      <hr />
      <br />
      <PieceCollections></PieceCollections>
    </div>
  </div>

  <CreateGameModal
    :class="{ 'is-active': isCreateGameModalActive }"
    @close="() => (isCreateGameModalActive = false)"
  ></CreateGameModal>

  <PreloadSpinner :isLoading="isLoading" />
  <MobileNotSupported></MobileNotSupported>
</template>

<script setup lang="ts">
import UserOverview from "@/components/gameOverview/UserOverview.vue";
import PieceCollections from "@/components/gameOverview/PieceCollections.vue";
import PreloadSpinner from "@/components/common/PreloadSpinner.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import CreateGameModal from "@/components/composition/CreateGameModal.vue";

import { ref, nextTick, onMounted } from "vue";

import MobileNotSupported from "@/components/common/MobileNotSupported.vue";

const isLoading = ref(true);
const isCreateGameModalActive = ref(false);

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  });
});
</script>

<style scoped lang="scss">
.columns {
  width: 100vw;
}
</style>
