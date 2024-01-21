import router from "@/router";
import { createApp } from "vue";
import { createPinia, Store } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Toast, { PluginOptions } from "vue-toastification";
import "tsconfig-paths";
import "vue-toastification/dist/index.css";
import { VueFire, VueFireAuth } from "vuefire";
import localForage from "localforage";
import firebaseApp from "@/firebaseInit";
import { PieceClass, PieceSelection } from "@/types/pieces";
import {
  ChessPiece,
  BoardChessPiece,
  ChessPiecePlayer,
  ChessPieceProperties,
  EthChessPiece,
  BOARD_HEIGHT,
  BOARD_WIDTH,
} from "@/types/index";
import * as _ from "lodash";

export async function persistGamePieces({
  playerAddress,
  playerType,
  gameAddress,
  pieces,
}: {
  playerAddress: string;
  playerType: ChessPiecePlayer;
  gameAddress: string;
  pieces: { [index: string]: BoardChessPiece };
}) {
  const dbDocument = `${playerType.toString()}-player_${playerAddress}-game_${gameAddress}`;
  await localForage.setItem(dbDocument, _.cloneDeep(pieces));
}

export async function retrieveGamePieces({
  playerAddress,
  playerType,
  gameAddress,
}: {
  playerAddress: string;
  playerType: ChessPiecePlayer;
  gameAddress: string;
}): Promise<Map<string, BoardChessPiece>> {
  const dbDocument = `${playerType.toString()}-player_${playerAddress}-game_${gameAddress}`;
  const pieces = (await localForage.getItem(dbDocument)) ?? {};
  return new Map(Object.entries(pieces));
}

export function flattenVisionArray(vision: number[][]): number[] {
  return vision.flat();
}

export function buildVisionArray(flatVision: number[]): number[][] {
  return create2DArrayReduce(flatVision, BOARD_WIDTH, BOARD_HEIGHT);
}

function create2DArrayReduce(arr: any[], rows: number, cols: number): any[][] {
  return arr.reduce((acc, item, i) => {
    const row = Math.floor(i / cols);
    acc[row] = acc[row] || [];
    acc[row].push(item);
    return acc;
  }, [] as any[][]);
}
