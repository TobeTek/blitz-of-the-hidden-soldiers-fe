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
                  v-model="piece.position.x"
                  @input="
                    (event) => (pieces[indx].position.x = event.target.value)
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
                  v-model="piece.position.y"
                  @input="
                    (event) => (pieces[indx].position.y = event.target.value)
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
import { defineProps, reactive, computed, onMounted, ref } from "vue";
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

const toast = useToast();
const pieceClassOptions = Object.keys(PieceClass).filter((x) =>
  Number.isNaN(Number(x))
);
const playerType = ChessPiecePlayer.WHITE;
const pieceSelection = reactive<PieceSelection[]>([
  {
    tokenId: KingTokens.STANDARD_KING,
    pieceClass: PieceClass.KING,
    count: 1,
  },
  {
    tokenId: QueenTokens.STANDARD_QUEEN,
    pieceClass: PieceClass.QUEEN,
    count: 1,
  },
  {
    tokenId: KnightTokens.STANDARD_KNIGHT,
    pieceClass: PieceClass.KNIGHT,
    count: 1,
  },
  {
    tokenId: BishopTokens.STANDARD_BISHOP,
    pieceClass: PieceClass.BISHOP,
    count: 1,
  },
  {
    tokenId: RookTokens.STANDARD_ROOK,
    pieceClass: PieceClass.ROOK,
    count: 1,
  },
  {
    tokenId: PawnTokens.STANDARD_PAWN,
    pieceClass: PieceClass.PAWN,
    count: 5,
  },
]);

const pieces = reactive<ChessPiece[]>([]);

onMounted(() => {
  buildPieces();
});

function buildPieces() {
  pieceSelection.forEach((selection) => {
    const uniquePieces = Array(selection.count)
      .fill(null)
      .map((_) => ({
        tokenId: selection.tokenId,
        pieceClass: selection.pieceClass,
        piecePlayer: playerType,
        position: { x: 1, y: 1 },
        isCaptured: false,
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
}

const props = defineProps({
  gameAddress: {
    type: String,
    required: true,
    default: ethers.ZeroAddress,
  },
});
const emit = defineEmits(["pieces-selected"]);

async function setPiecePositions() {
  if (!validatePiecePositions()) return;
}

function validatePiecePositions() {
  const seenPieceIds = new Array<string>();
  const seenPositions = new Array<Coordinate>();

  console.log(pieces);
  for (let index = 0; index < pieces.length; index++) {
    const piece = pieces[index];

    // Check for duplicate piece IDs
    if (piece.pieceId && seenPieceIds.includes(piece.pieceId)) {
      toast.error("Duplicate piece IDs not allowed");
      return false;
    }
    seenPieceIds.push(piece.pieceId);

    // Check for duplicate coordinates
    const position = piece.position;
    console.log(seenPositions, position);
    if (
      seenPositions.filter((p) => position.x === p.x && position.y === p.y)
        .length
    ) {
      toast.error("Duplicate piece positions not allowed");
      return false;
    }
    seenPositions.push(position);

    // XXX: Validate coordinates are 'sensible'
    // This should be enforced on the smart contract and circuit as well
    let isInsensibleCoordinate = false;
    switch (playerType) {
      case ChessPiecePlayer.WHITE.valueOf():
        isInsensibleCoordinate ||= position.y > 3;
        break;
      case ChessPiecePlayer.BLACK.valueOf():
        isInsensibleCoordinate ||= position.y < 6;
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
