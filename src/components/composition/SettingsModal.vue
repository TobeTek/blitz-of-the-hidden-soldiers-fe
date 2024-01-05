<template>
  <BaseModal>
    <template #modal-content>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title has-text-centered">Select Z-Key Files</p>
        </header>
        <section class="modal-card-body">
          <fieldset class="fieldset">
            <label class="label">Piece Motion Zkey:</label>
            <small
              >Current Value: <i>{{ store.pieceMotionZkey.name }}</i></small
            >
            <div class="field">
              <div class="control is-expanded">
                <input
                  class="input"
                  type="file"
                  accept=".zkey"
                  required
                  @change="changePieceMotionZkey"
                />
              </div>
            </div>

            <label class="label">Piece Motion WASM:</label>
            <p>
              Current Value: <i>{{ store.pieceMotionWasm.name }}</i>
            </p>
            <div class="field has-addons">
              <div class="control is-expanded">
                <input
                  class="input"
                  type="file"
                  required
                  accept=".wasm"
                  @change="changePieceMotionWasm"
                />
              </div>
            </div>
          </fieldset>
          <hr />
          <fieldset class="fieldset">
            <label class="label">Player Vision Zkey:</label>
            <small
              >Current Value: <i>{{ store.playerVisionZkey.name }}</i></small
            >
            <div class="field">
              <div class="control is-expanded">
                <input
                  class="input"
                  type="file"
                  required
                  accept=".zkey"
                  @change="changePlayerVisionZkey"
                />
              </div>
            </div>

            <label class="label">Player Vision WASM:</label>
            <p>
              Current Value: <i>{{ store.playerVisionWasm.name }}</i>
            </p>
            <div class="field has-addons">
              <div class="control is-expanded">
                <input
                  class="input"
                  type="file"
                  required
                  accept=".wasm"
                  @change="changePlayerVisionWasm"
                />
              </div>
            </div>
          </fieldset>
          <hr />
          <fieldset class="fieldset">
            <label class="label">Reveal Positions Zkey:</label>
            <small
              >Current Value: <i>{{ store.revealPositionZkey.name }}</i></small
            >
            <div class="field">
              <div class="control is-expanded">
                <input
                  class="input"
                  type="file"
                  required
                  accept=".zkey"
                  @change="changeRevealPositionZkey"
                />
              </div>
            </div>

            <label class="label">Reveal Positions WASM:</label>
            <p>
              Current Value: <i>{{ store.revealPositionWasm.name }}</i>
            </p>
            <div class="field has-addons">
              <div class="control is-expanded">
                <input
                  class="input"
                  type="file"
                  required
                  accept=".wasm"
                  @change="changeRevealPositionWasm"
                />
              </div>
            </div>
          </fieldset>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success is-fullwidth"
            @click="emit('save-settings')"
          >
            Save Settings
          </button>
        </footer>
        <div class="has-text-centered">
          <small
            ><a class="underline-link" href=""
              >>>> Find out more on the wiki</a
            ></small
          >
          <br />
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "@/components/composition/BaseModal.vue";
import { useVerifierZkeyStore } from "@/stores/verifierZkeyStore";
import { ChessPiecePlayer } from "@/types";
import { PieceClass, calculatePublicCommitment } from "@/types/pieces";
import { isValidFilePathRegex } from "@/utils";
import Worker from "@/worker?worker";
import { useToast } from "vue-toastification";

const emit = defineEmits(["save-settings"]);
const toast = useToast();
const store = useVerifierZkeyStore();

const worker = new Worker();
worker.onmessage = (e: MessageEvent) => {
  console.log("Generated Proof:", e.data);
};

async function testSnarkjs() {
  const p: ChessPiece = {
    pieceId: "001",
    piecePlayer: ChessPiecePlayer.WHITE,
    pieceType: PieceClass.KING,
    position: {
      x: 1,
      y: 1,
    },
    isCaptured: false,
  };
  const targetPos = { x: 2, y: 1 };
  const prevCommit = await calculatePublicCommitment(p);
  const workerData = {
    proofData: {
      prevPublicCommitment: prevCommit,
      pieceId: p.pieceId,
      pieceType: p.pieceType,
      pieceInitialPosition: [p.position.x, p.position.y],
      pieceTargetPosition: [targetPos.x, targetPos.y],
    },

    wasm: await store.getPieceMotionWasmBuffer(),
    zkey: await store.getPieceMotionZkeyBuffer(),
  };
  worker.postMessage(workerData);
}

async function changePieceMotionZkey(event: any) {
  const [file] = event.target.files;
  store.pieceMotionZkey = file;
}
async function changePieceMotionWasm(event: any) {
  const [file] = event.target.files;
  store.pieceMotionWasm = file;
}

async function changePlayerVisionZkey(event: any) {
  const [file] = event.target.files;
  store.playerVisionZkey = file;
}
async function changePlayerVisionWasm(event: any) {
  const [file] = event.target.files;
  store.playerVisionWasm = file;
}

async function changeRevealPositionZkey(event: any) {
  const [file] = event.target.files;
  store.revealPositionZkey = file;
}
async function changeRevealPositionWasm(event: any) {
  const [file] = event.target.files;
  store.revealPositionWasm = file;
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.modal-card {
  border-radius: 20px;
  background-color: $graphite-gray-ui;
  * {
    background-color: inherit;
    color: $white-ui;
  }

  .modal-card-head {
    background-color: $midnight-black-ui;
  }

  input,
  .icon,
  select,
  option {
    background-color: $bright-gray-ui;
  }

  input {
    border-radius: 1rem !important;
  }
}

.modal-card-title {
  font-size: larger;
  text-align: center;
  display: inline-block;
  width: 100%;
}

.underline-link:hover {
  color: $charcoal-gray-ui;
  transition: color 0.3s ease-in-out;
}
</style>
