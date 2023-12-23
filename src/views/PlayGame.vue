<template>
    <div class="columns is-justify-content-flex-end">
        <div class="column is-2 is-mobile">
            <Sidebar></Sidebar>
        </div>
        <div class="column is-8">
            <ChessBoard></ChessBoard>
        </div>
        <div class="column is-2">
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, nihil sapiente? Quaerat similique culpa, voluptas tenetur rerum voluptate optio esse, dolorem unde repellendus nobis quos eius commodi velit sapiente quae.</h2>
        </div>
    </div>
    <PreloadSpinner :isLoading="isLoading"/>
    <MobileNotSupportedVue></MobileNotSupportedVue>
</template>

<script setup lang="ts">
import UserOverview from "@/components/gameOverview/UserOverview.vue";
import PieceCollections from "@/components/gameOverview/PieceCollections.vue";
import PreloadSpinner from "@/components/common/PreloadSpinner.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import ChessBoard from "@/components/playGame/ChessBoard.vue";
import MobileNotSupportedVue from "@/components/common/MobileNotSupported.vue";

import { ref, nextTick, onMounted } from "vue";

const isLoading = ref(true);

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
        isLoading.value = false;
    }, 1000);
  })
});

</script>

<style scoped lang="scss">
.columns{
    width: 100vw;
}
</style>