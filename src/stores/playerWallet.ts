import { BrowserProvider, Signer, ethers } from "ethers";
import { defineStore } from "pinia";
import { computed, markRaw, ref } from "vue";
import { useToast } from "vue-toastification";
import { useInitializeStore } from "./initializeStore";

const toast = useToast();

export interface PlayerWalletStore {
  walletAddress: string;
  walletChainId: number;
  provider: BrowserProvider;
  signer: Signer;
  isWalletConnected(): boolean;
}

export const usePlayerWalletStore = defineStore(
  "playerWalletStore",
  (): PlayerWalletStore => {
    const walletAddress = ref(),
      walletChainId = ref(),
      provider = ref(),
      signer = ref();

    const { initialized, loading } = useInitializeStore(async () => {
      let _provider = new ethers.BrowserProvider(window.ethereum);
      let _signer = await _provider.getSigner();
      const chainId = (await _provider.getNetwork()).chainId;
      await _provider.send("eth_requestAccounts", []);
      walletAddress.value = await _signer.getAddress();
      walletChainId.value = chainId;
      provider.value = markRaw(_provider);
      signer.value = markRaw(_signer);
    });

    // Getter for accessing data.
    const isWalletConnected = computed(() => {
      return walletAddress.value == ethers.ZeroAddress;
    });

    return {
      walletAddress,
      walletChainId,
      provider,
      signer,
      isWalletConnected,
      initialized,
      loading,
    };
  }
);

export async function connectWallet() {
  if (window.ethereum == null) {
    toast.error("MetaMask not installed; Please install to use this site!");
  } else {
  }
}
