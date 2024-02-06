<template>
  <div id="container" class="p-4">
    <div class="box">
      <header>
        <div>
          <h1>Set your Piece Positions!</h1>

          <h3>Game: {{ fmtShortAddress(props.gameAddress) }}</h3>
          <p class="has-text-centered">
            <small>This action can only be performed once!</small>
          </p>
        </div>
      </header>
      <section>
        <div
          v-for="(piece, indx) in pieces"
          :key="piece.pieceId"
          class="columns is-vcentered"
        >
          <div class="column has-text-left">
            <label class="label">Piece ID</label>
            <div class="control">
              <input
                class="input"
                type="text"
                required
                v-model="piece.pieceId"
                disabled
              />
            </div>
          </div>

          <div class="column has-text-centered">
            <label class="label">Token ID/Piece Class</label>
            <div class="field has-addons">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  required
                  :value="piece.tokenId"
                  disabled
                />
              </div>
              <div class="control">
                <select
                  v-model="piece.pieceClass"
                  class="select has-text-centered piece-class"
                  required
                  disabled
                >
                  <option
                    v-for="pieceClass in pieceClassOptions"
                    :key="pieceClass"
                    :value="PieceClass[pieceClass]"
                  >
                    {{ pieceClass }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="column has-text-right">
            <label class="label">Coordinate</label>
            <div class="field has-addons">
              <div class="control has-icons-left coordinate">
                <input
                  class="input"
                  type="number"
                  min="1"
                  max="8"
                  v-model="piece.pieceCoords.x"
                  @input="
                    (event) => (pieces[indx].pieceCoords.x = event.target.value)
                  "
                  required
                />
                <span class="icon is-small is-left"> <i>X:</i> </span>
              </div>
              <div class="control has-icons-left coordinate">
                <input
                  class="input"
                  type="number"
                  min="1"
                  max="8"
                  v-model="piece.pieceCoords.y"
                  @input="
                    (event) => (pieces[indx].pieceCoords.y = event.target.value)
                  "
                  required
                />
                <span class="icon is-small is-left"> <i>Y:</i> </span>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </section>
      <footer>
        <button
          class="button is-success is-fullwidth"
          @click="setPiecePositions"
        >
          <b>Set Piece Positions</b>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fmtShortAddress } from "@/utils";
import { defineProps, reactive, computed, onMounted, ref, toRaw } from "vue";
import { ethers } from "ethers";
import {
  PieceSelection,
  PieceClass,
  KnightTokens,
  BishopTokens,
  RookTokens,
} from "@/types/pieces";
import { ChessPiece, ChessPiecePlayer, Coordinate } from "@/types";
import BaseModal from "@/components/composition/BaseModal.vue";
import { GameManagerContract } from "@/ethContracts/gameManager";
import { PawnTokens, KingTokens, QueenTokens } from "@/types/pieces";
import { useToast } from "vue-toastification";
import * as _ from "lodash";
import { usePlayerWalletStore } from "@/stores/playerWallet";
import { ChessGameContract } from "@/ethContracts/chessGame";
import {
  persistGamePieces,
  retrieveGamePieces,
} from "@/utils/piecePersistence";

const toast = useToast();
const props = defineProps({
  gameAddress: {
    type: String,
    required: true,
    default: ethers.ZeroAddress,
  },
  playerAddress: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["positions-selected"]);

const pieceClassOptions = Object.keys(PieceClass).filter((x) =>
  Number.isNaN(Number(x))
);
const playerType = ChessPiecePlayer.WHITE;
const pieceSelection = ref<PieceSelection[]>([]);
const pieces = reactive<ChessPiece[]>([]);
const pieceMapping = computed(() => {
  const allPieces = {};
  for (const piece of pieces) {
    allPieces[piece.pieceId] = piece;
  }
  return allPieces;
});

onMounted(() => {
  buildPieces().catch();
});

async function buildPieces() {
  pieceSelection.value = await GameManagerContract.getPlayerSelection(
    props.gameAddress,
    props.playerAddress
  );
  pieceSelection.value.forEach((selection) => {
    const uniquePieces = Array(Number(selection.count))
      .fill(null)
      .map((_) => ({
        tokenId: selection.tokenId,
        pieceClass: selection.pieceClass,
        piecePlayer: playerType,
        pieceCoords: { x: 1, y: 1 },
        isDead: false,
        updatedAt: 0,
      }));
    pieces.push(...uniquePieces);
  });
  for (let index = 0; index < pieces.length; index++) {
    const piece = pieces[index];
    const genPieceId = ethers
      .sha256(
        ethers.encodeBytes32String((Math.random() * Math.random()).toString())
      )
      .slice(0, 9);
    pieces.splice(index, 1, { pieceId: genPieceId, ...piece });
  }

  console.log("PieceMapping: ", pieceMapping);
}

async function setPiecePositions() {
  if (!validatePiecePositions()) return;
  const chessGameInstance = await ChessGameContract.buildInstance(
    props.gameAddress
  );
  await chessGameInstance.placePieces(pieces);

  persistGamePieces({
    playerAddress: props.playerAddress,
    gameAddress: props.gameAddress,
    playerType: playerType,
    pieces: pieceMapping.value,
  });
  emit("positions-selected");
}

function validatePiecePositions() {
  const seenPieceIds = new Array<string>();
  const seenPositions = new Array<Coordinate>();

  for (let index = 0; index < pieces.length; index++) {
    const piece = pieces[index];

    // Check for duplicate piece IDs
    if (piece.pieceId && seenPieceIds.includes(piece.pieceId)) {
      toast.error("Duplicate piece IDs not allowed");
      return false;
    }
    seenPieceIds.push(piece.pieceId);

    // Check for duplicate coordinates
    const pieceCoords = piece.pieceCoords;
    if (
      seenPositions.filter(
        (p) => pieceCoords.x === p.x && pieceCoords.y === p.y
      ).length
    ) {
      toast.error("Duplicate piece positions not allowed");
      return false;
    }
    seenPositions.push(pieceCoords);

    // XXX: Validate coordinates are 'sensible'
    // This should be enforced on the smart contract and circuit as well
    let isInsensibleCoordinate = false;
    switch (playerType) {
      case ChessPiecePlayer.WHITE.valueOf():
        isInsensibleCoordinate ||= pieceCoords.y > 3;
        break;
      case ChessPiecePlayer.BLACK.valueOf():
        isInsensibleCoordinate ||= pieceCoords.y < 6;
        break;
      default:
        break;
    }
    if (isInsensibleCoordinate) {
      toast.error(
        "Selected piece positions are not within reasonable limits. White pieces must be placed on the rows 1-3, Black pieces can be placed on rows 6-8"
      );
    }
  }

  return true; // No duplicates found
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

header {
  margin-bottom: 2rem;
}
.box {
  background-color: $graphite-gray-ui;
  * {
    background-color: inherit;

    color: $white-ui;
  }

  input,
  .icon,
  select,
  option {
    background-color: $dark-charcoal-ui;
  }
}

select.piece-class {
  font-weight: bold;
  //   width: 100%;
  border-radius: 0 0 5px;
  height: 2.5rem;
}

.coordinate {
  width: 50%;
}

input:disabled,
select:disabled {
  opacity: 0.5;
  border: none;
}
</style>
