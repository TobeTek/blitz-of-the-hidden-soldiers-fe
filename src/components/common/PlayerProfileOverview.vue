<template>
  <div v-if="isWalletConnected" class="card" id="playerProfile">
    <div class="card-content">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <img
              :src="`https://api.dicebear.com/7.x/big-ears/jpg?flip=false&seed=${store.walletAddress}`"
              alt=""
              class="player-avatar"
            />
          </div>
        </div>
        <div class="level-item">
          <span class="player-name">
            {{ fmtShortAddress(store.walletAddress) }}
          </span>
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <div class="level">
        <div class="level-left">
          <div class="level-item pl-4">&ac; wins</div>
        </div>
        <div class="level-right">
          <div class="level-item">&ac; loss</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ethers } from "ethers";
import { usePlayerWalletStore } from "@/stores/playerWallet";
import { fmtShortAddress } from "@/utils";

const store = usePlayerWalletStore();
const isWalletConnected = store.isWalletConnected;

const _onMounted = async () => {
  return;
  let provider;
  let signer;
  if (window.ethereum == null) {
    toast.error("MetaMask not installed; Please install to use this site!");
  } else {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const chainId = (await provider.getNetwork()).chainId;
    provider.send("eth_requestAccounts", []).then(async () => {
      await store.accountChanged(signer, chainId, provider);
    });
  }
};

onMounted(() => {
  _onMounted().catch();
});
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

#connect-wallet {
  button {
    padding: 1vw;
    margin-left: -0.5vw;
  }
}
.card {
  background-color: $graphite-gray-ui;
  width: 90%;
  margin: 0 auto;
  color: $white-ui;
  border-radius: 20px;

  border: 1.5px solid $charcoal-gray-ui;
  .level {
    width: 100%;
  }
}

.card-footer {
  font-size: small;
  height: 3em;

  .level {
    padding: 0 5px;
  }
}

.player-name {
  display: inline-block;
  margin: 0 10px;
}
.player-avatar {
  height: 2em;
  border-radius: 200000px;
}
</style>
