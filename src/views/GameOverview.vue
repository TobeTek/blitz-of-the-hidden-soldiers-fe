<template>
  <div class="columns is-justify-content-flex-end">
    <div class="column is-2 is-mobile">
      <Sidebar></Sidebar>
    </div>
    <div class="column is-mobile" id="main">
      <UserOverview></UserOverview>
      <br />
      <hr />
      <br />
      <PieceCollections></PieceCollections>
    </div>
  </div>

  <PreloadSpinner :isLoading="isLoading" />
  <MobileNotSupported></MobileNotSupported>
</template>

<script setup lang="ts">
import UserOverview from "@/components/gameOverview/UserOverview.vue";
import PieceCollections from "@/components/gameOverview/PieceCollections.vue";
import PreloadSpinner from "@/components/common/PreloadSpinner.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import { ref, nextTick, onMounted } from "vue";
import { useToast } from "vue-toastification";
import MobileNotSupported from "@/components/common/MobileNotSupported.vue";


const isLoading = ref(true);
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  });


//   const toast = useToast();
//   toast("I'm a toast!");
//   toast.success("I'm a toast!");
});
</script>

<style scoped lang="scss">
.columns {
  width: 100vw;
}
</style>
