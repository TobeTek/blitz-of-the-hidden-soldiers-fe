<template>
  <BaseModal>
    <template #modal-content>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title has-text-centered">
            Play against an Opponent
          </p>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Opponent Address</label>
            <div class="control">
              <input class="input" type="text" placeholder="0x00...123" />
            </div>
          </div>

          <div class="field">
            <div class="control has-text-centered">
              <label class="radio p-2">
                <input type="radio" name="question" />
                Play as white
              </label>
              <label class="radio p-2">
                <input type="radio" name="question" />
                Play as black
              </label>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success is-fullwidth"
            @click="initCreateGame()"
          >
            Create game
          </button>
        </footer>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import {
  getFirestore,
  getDoc,
  getDocs,
  query,
  where,
  collection,
  doc,
} from "firebase/firestore";
import BaseModal from "@/components/composition/BaseModal.vue";
import { getGameManagerInstance } from "@/ethContracts/gameManager";
import firebase from "@/firebaseInit";
import { inject, provide } from "vue";
import { usePlayerWalletStore } from "@/stores/playerWallet";
import { Contract, ethers } from "ethers";

const db = getFirestore(firebase);

async function initCreateGame() {
  const collectionRef = collection(
    db,
    "eth-deployments/smart-contracts/chains"
  );
  const docRef = doc(db, "eth-deployments/smart-contracts/");
  const store = usePlayerWalletStore();
  const result = await getDoc(docRef);
  let dData = result.data();
  const chainInformation = dData[store.walletChainId][0];
  console.log(chainInformation);

  console.log(chainInformation);

  let provider = new ethers.BrowserProvider(window.ethereum);
  let signer = await provider.getSigner();

  const GameManager = new Contract(
    chainInformation.contracts["GameManager"].address,
    chainInformation.contracts["GameManager"].abi,
    signer
  );

  console.log(await GameManager.chessCollectionAddress());
  console.log(
    await GameManager.updateChessCollectionAddress(signer.getAddress())
  );
  console.log(await GameManager.owner());
  let r = await GameManager.unlockPlayerTokens(signer.getAddress(), 1, 20);
  console.log(r);
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
}
</style>
