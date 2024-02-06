import { BrowserProvider, Signer, ethers } from "ethers";
import { defineStore } from "pinia";
import { computed, markRaw, ref } from "vue";
import { useToast } from "vue-toastification";
import { useInitializeStore } from "./initializeStore";
import { stringifyQuery } from "vue-router";
import { ChessPiecePlayer } from "@/types";

const toast = useToast();

export interface PlayerWalletStore {
  walletAddress: string;
  walletChainId: number;
  provider: BrowserProvider;
  signer: Signer;
  isWalletConnected(): boolean;
  getPlayerType(): ChessPiecePlayer;
  getOpponentAddress(): string;
}

export const usePlayerWalletStore = defineStore(
  "playerWalletStore",
  (): PlayerWalletStore => {
    const walletAddress = ref(),
      walletChainId = ref(),
      provider = ref(),
      signer = ref();

    const { initialized, loading } = useInitializeStore(async () => {
      if (window.ethereum) {
        let _provider = new ethers.BrowserProvider(window.ethereum);
        let _signer = await _provider.getSigner();
        const chainId = (await _provider.getNetwork()).chainId;
        await _provider.send("eth_requestAccounts", []);
        walletAddress.value = await _signer.getAddress();
        walletChainId.value = chainId;
        provider.value = markRaw(_provider);
        signer.value = markRaw(_signer);
      } else {
        toast.warning(
          "You don't have MetaMask installed! Install a Web3 wallet to interact with this DApp",
          { timeout: 50000 }
        );
        throw new Error("User does not have MetaMask installed");
      }
    });

    const isWalletConnected = computed(() => {
      return walletAddress.value == ethers.ZeroAddress;
    });

    const getPlayerType = computed(
      ({
        playerWhite,
        playerBlack,
        playerAddress,
      }: {
        playerWhite: string;
        playerBlack: string;
        playerAddress: string;
      }) => {
        if (playerWhite == playerAddress) {
          return ChessPiecePlayer.WHITE;
        } else {
          return ChessPiecePlayer.BLACK;
        }
      }
    );

    const getOpponentAddress = computed(
      ({
        playerWhite,
        playerBlack,
        playerAddress,
      }: {
        playerWhite: string;
        playerBlack: string;
        playerAddress: string;
      }) => {
        if (playerWhite == playerAddress) {
          return playerBlack;
        } else {
          return playerWhite;
        }
      }
    );

    return {
      walletAddress,
      walletChainId,
      provider,
      signer,
      isWalletConnected,
      getPlayerType,
      getOpponentAddress,
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
