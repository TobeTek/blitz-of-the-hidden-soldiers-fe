import { PlayerWalletStore, usePlayerWalletStore } from "@/stores/playerWallet";
import { ChessPieceProperties } from "@/types";
import { PieceSelection } from "@/types/pieces";
import { AddressLike, Contract, ethers } from "ethers";
import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { TokenBalance } from "@/types";
import * as _ from "lodash";

export class ChessPieceCollectionContract {
  static _instance: Contract;
  static _store: PlayerWalletStore;
  static _owner: string;
  static _defaultTokenOwner: string;

  constructor() {}

  static async getInstance(): Promise<Contract> {
    if (!ChessPieceCollectionContract._instance) {
      ChessPieceCollectionContract._instance = await this.buildInstance();
    }
    return ChessPieceCollectionContract._instance;
  }

  static async buildInstance(): Promise<Contract> {
    const db = useFirestore();
    const docRef = doc(db, "eth-deployments/smart-contracts/");
    const store = usePlayerWalletStore() as PlayerWalletStore;
    const result = await getDoc(docRef);
    const data = result.data();
    console.log(data, store.walletChainId);
    const chainInformation = data[store.walletChainId][0];
    let signer = await store.provider.getSigner();

    ChessPieceCollectionContract._store = store;
    return new Contract(
      chainInformation.contracts["ChessPieceCollection"].address,
      chainInformation.contracts["ChessPieceCollection"].abi,
      signer
    );
  }

  static async getPlayerTokens(playerAddress: string): Promise<TokenBalance[]> {
    const tokenBalances = new Map<number, TokenBalance>();

    const collection = await ChessPieceCollectionContract.getInstance();
    const owner = await ChessPieceCollectionContract.getDefaultTokenOwner();
    const defaultTokensTransferSingleFilter = collection.filters.TransferSingle(
      null,
      null,
      owner
    );
    const defaultTokensTransferBatchFilter = collection.filters.TransferBatch(
      null,
      null,
      owner
    );
    const playerTokensFilter = collection.filters.TransferSingle(
      null,
      null,
      playerAddress
    );
    const defaultTokensTransferSingleEvents = await collection.queryFilter(
      defaultTokensTransferSingleFilter,
      0,
      "latest"
    );
    const defaultTokensTransferBatchEvents = await collection.queryFilter(
      defaultTokensTransferBatchFilter,
      0,
      "latest"
    );
    const defaultTokensEvents = [
      ...defaultTokensTransferSingleEvents,
      ...defaultTokensTransferBatchEvents,
    ];
    const playerTokensEvents = await collection.queryFilter(
      playerTokensFilter,
      0,
      "latest"
    );
    for (const event of defaultTokensEvents) {
      const tokenIds = event.args[3];
      const tokenQuantities = event.args[4];
      for (let index = 0; index < tokenIds.length; index++) {
        const tokenId = Number(tokenIds[index]);
        const tokenBalance = tokenBalances.get(tokenId) ?? {
          tokenId: tokenId,
          quantity: 0n,
        };
        tokenBalance.quantity += tokenQuantities[index];
        tokenBalances.set(tokenId, tokenBalance);
      }
    }
    for (const event of playerTokensEvents) {
      const tokenIds = event.args[3];
      const tokenQuantities = event.args[4];
      for (let index = 0; index < tokenIds.length; index++) {
        const tokenId = Number(tokenIds[index]);
        const tokenBalance = tokenBalances.get(tokenId) ?? {
          tokenId: tokenId,
          quantity: 0n,
        };
        tokenBalance.quantity += tokenQuantities[index];
        tokenBalances.set(tokenId, tokenBalance);
      }
    }

    // Get token properties
    for (const tokenId of tokenBalances.keys()) {
      const tokenBalance = tokenBalances.get(tokenId);
      tokenBalance.properties = await collection.tokenProperties(tokenId);
      tokenBalances.set(tokenId, tokenBalance);
    }
    return Array.from(tokenBalances.values());
  }

  static async approveManagerToLockTokens(
    gameManagerAddress: string,
    playerAddress: string
  ) {
    const collection = await ChessPieceCollectionContract.getInstance();

    const isApproved = await collection.isApprovedForAll(
      playerAddress,
      gameManagerAddress
    );
    if (isApproved) return;
    await collection.setApprovalForAll(gameManagerAddress, true);
  }

  static async getOwner(): Promise<string> {
    if (!ChessPieceCollectionContract._owner) {
      const collection = await ChessPieceCollectionContract.getInstance();
      ChessPieceCollectionContract._owner = await collection.owner();
    }
    return ChessPieceCollectionContract._owner;
  }

  static async getDefaultTokenOwner(): Promise<string> {
    if (!ChessPieceCollectionContract._defaultTokenOwner) {
      const collection = await ChessPieceCollectionContract.getInstance();
      ChessPieceCollectionContract._defaultTokenOwner =
        await collection.defaultTokenOwner();
    }
    return ChessPieceCollectionContract._defaultTokenOwner;
  }
}
