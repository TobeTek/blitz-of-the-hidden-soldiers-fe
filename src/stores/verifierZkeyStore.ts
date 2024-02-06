import { defineStore } from "pinia";
import { ethers, Signer, BrowserProvider } from "ethers";

export const useVerifierZkeyStore = defineStore("verifierZkeyStore", {
  state: () => ({
    pieceMotionZkey: {} as File,
    pieceMotionWasm: {} as File,

    playerVisionZkey: {} as File,
    playerVisionWasm: {} as File,

    revealPositionZkey: {} as File,
    revealPositionWasm: {} as File,
  }),
  getters: {},
  actions: {
    async getPieceMotionZkeyBuffer(): Promise<Uint8Array> {
      const buffer = await this.pieceMotionZkey.arrayBuffer();
      return new Uint8Array(buffer);
    },
    async getPieceMotionWasmBuffer(): Promise<Uint8Array> {
      const buffer = await this.pieceMotionWasm.arrayBuffer();
      return new Uint8Array(buffer);
    },
    async getPlayerVisionZkeyBuffer(): Promise<Uint8Array> {
      const buffer = await this.playerVisionZkey.arrayBuffer();
      return new Uint8Array(buffer);
    },
    async getPlayerVisionWasmBuffer(): Promise<Uint8Array> {
      const buffer = await this.playerVisionWasm.arrayBuffer();
      return new Uint8Array(buffer);
    },
    async getRevealPositionsZkeyBuffer(): Promise<Uint8Array> {
      const buffer = await this.revealPositionZkey.arrayBuffer();
      return new Uint8Array(buffer);
    },
    async getRevealPositionsWasmBuffer(): Promise<Uint8Array> {
      const buffer = await this.revealPositionWasm.arrayBuffer();
      return new Uint8Array(buffer);
    },
  },
  $persistIndexDB: ["pieceMotionZkey", "pieceMotionWasm", "playerVisionZkey", "playerVisionWasm","revealPositionZkey", "revealPositionWasm"]
    ,
});
