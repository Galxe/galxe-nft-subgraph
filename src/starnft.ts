import { BigInt, Bytes, Address, log } from "@graphprotocol/graph-ts"
import {
  StarNFT,
  Transfer,
} from "../generated/templates/StarNFT/StarNFT"

import {
  NFT,
  NFTMintTransaction,
} from "../generated/schema"
import {
  ADDRESS_ZERO
} from "./helper"


export function handleTransfer(event: Transfer): void {
  let nft_contract = event.address;
  let from = event.params.from
  let to = event.params.to;
  let nft_id = event.params.tokenId;

  log.debug("NFT {} {} transfer from {} to {}", [
    nft_contract.toHexString(), 
    nft_id.toString(), 
    from.toHexString(),
    to.toHexString()]);

  if (from.toHexString() == ADDRESS_ZERO.toHexString()) {
    // Wheather is Claim or ClaimBatch, this tx only contains one nft contract
    // mint event
    let tx = NFTMintTransaction.load(event.transaction.hash.toHexString());
    if (tx == null) {
      tx = new NFTMintTransaction(event.transaction.hash.toHexString());
      tx.nftContract = nft_contract;
      tx.nftID = nft_id;
      tx.from = from;
      tx.to = to;
      tx.block = event.block.number;
      tx.save();
    }
    return;
  }
  // nft
  let nft_model_id = nft_contract.toHexString().concat("-").concat(nft_id.toString());
  let nft = NFT.load(nft_model_id);
  if (nft == null) {
    log.error("NFT Not Found {} {}", [nft_contract.toHexString(), nft_id.toString()]);
    return;
  }
  nft.owner = to;
  nft.save();
}
