import { defineStore } from "pinia";
import { ethers, Signer, Provider } from "ethers";
import { fmtShortAddress } from "@/utils";
import { markRaw } from "vue";

export const usePlayerWalletStore = defineStore("playerWalletStore", {
  state: () => ({
    walletAddress: ethers.ZeroAddress,
    walletChainId: 0,
    provider: undefined as unknown as Provider,
    signer: undefined as unknown as Signer,
  }),
  getters: {
    isWalletConnected: (state) => {
      return state.walletAddress == ethers.ZeroAddress;
    },
  },
  actions: {
    async accountChanged(signer: Signer, chainId: number, provider: Provider) {
      this.walletAddress = await signer.getAddress();
      this.walletChainId = chainId;
      this.provider = markRaw(provider);
      this.signer = markRaw(signer);
    },
  },
});
