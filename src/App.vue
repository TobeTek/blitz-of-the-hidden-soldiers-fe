<template>
  <main class="full-width">
    <router-view />
    
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from "vue";
import { ethers } from "ethers";
import { usePlayerWalletStore } from "@/stores/playerWallet";
import { fmtShortAddress } from "@/utils";
import { GameManagerContract } from "@/ethContracts/gameManager";
import { useToast } from "vue-toastification";

const toast = useToast();
const store = usePlayerWalletStore();


async function connectWallet() {
  if (window.ethereum == null) {
    toast.error("MetaMask not installed; Please install to use this site!");
  } else {
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    const chainId = (await provider.getNetwork()).chainId;
    provider.send("eth_requestAccounts", []).then(async () => {
      await store.accountChanged(signer, chainId, provider);
    });
  }
}

async function listenForEvents() {
  let gameManager = await GameManagerContract.getInstance();
  gameManager.on("*", (args: any[]) => {
    console.log("Unfiltered: ", args);
  });
}

onBeforeMount(() => {
  // connectWallet().catch();
  listenForEvents().catch();
});
</script>

<style lang="scss">
@import "assets/styles/_variables.scss";
@import "assets/styles/_base.scss";
@import "assets/styles/main.scss";
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");

html {
  background-color: $midnight-blue-ui;
  color: $white-ui;
  margin: 0;
  padding: 0;

  font-size: calc(60% + 0.8vmin);
}

.full-width {
  width: 100vw;
}

::-webkit-scrollbar {
  width: 8px;
  background: #222;
}

::-webkit-scrollbar-thumb {
  background: $dark-charcoal-ui;
  border-radius: 4px;
}
</style>
