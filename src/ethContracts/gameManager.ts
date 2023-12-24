import { usePlayerWalletStore } from "@/stores/playerWallet";
import { Contract } from "ethers";
import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";
import { useFirestore } from "vuefire";

export async function getGameManagerInstance() {
  const db = useFirestore();
  const collectionRef = collection(
    db,
    "eth-deployments/smart-contracts/chains"
  );
  const store = usePlayerWalletStore();
  const q = query(collectionRef, where("chainId", "==", store.walletChainId));
  const result = await getDocs(q);
  const chainInformation = result[0];

  return new Contract(
    chainInformation.GameManager.address,
    chainInformation.GameManager.abi,
    store.provider
  );
}
