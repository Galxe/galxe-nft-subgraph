import { BigInt, log } from "@graphprotocol/graph-ts"
import { NFTCreated } from "../generated/StarNFTFactory/StarNFTFactory"

import {
  StarNFT as StarNFTTemplate,
} from "../generated/templates"

import {
  StarNFT,
  StarNFTFactory
} from "../generated/schema"


export function handleStarNFTCreated(event: NFTCreated): void {

  log.debug("--> New StarNFT Created: {}", [event.params.starAddr.toHexString()]);

  let factory = StarNFTFactory.load(event.address.toHexString());
  if (factory == null) {
    factory = new StarNFTFactory(event.address.toHexString());
    factory.starNFTs = new Array<string>();
  }

  let nft_contract = event.params.starAddr;
  let nft = new StarNFT(nft_contract.toHexString());
  nft.save();

  factory.starNFTs.push(nft_contract.toHexString());
  factory.save();

  StarNFTTemplate.create(nft_contract);
}
