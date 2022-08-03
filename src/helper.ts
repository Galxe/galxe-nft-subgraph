/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Bytes, Address } from "@graphprotocol/graph-ts";
import {
  SpaceStation,
  StarNFT,
  Campaign
} from "../generated/schema"

export class EventModel {
  spaceStationAddr: Address;
  txHash: Bytes;
  block: BigInt;
  logIndex: BigInt;
  timestamp: BigInt;
}

export class NFTModel {
  campaignID: BigInt;
  user: Address;
  verifyIDs: Array<BigInt>;
  nftIDs: Array<BigInt>;
  nftContract: Address;
  cap: BigInt; // TODO: handle this
}

export const ADDRESS_ZERO = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let TWO_BI = BigInt.fromI32(2);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function bigDecimalExp18(): BigDecimal {
  return BigDecimal.fromString("1000000000000000000");
}

export function convertEthToDecimal(eth: BigInt): BigDecimal {
  return eth.toBigDecimal().div(ONE_BD);
}

// model functions

export function createSpaceStation(address: string, version: BigInt): SpaceStation { 
  let sss = SpaceStation.load(address);
  if (sss === null) {
    sss = new SpaceStation(address);
    sss.version = version;
    sss.save();
  }
  return sss as SpaceStation;
}

export function createStarNFT(address: string): StarNFT {
  let snf = StarNFT.load(address);
  if (snf === null) {
    snf = new StarNFT(address);
    snf.save();
  }
  return snf as StarNFT;
}

export function createCampaign(cid: string): Campaign {
  let campaign = Campaign.load(cid);
  if (campaign === null) {
    campaign = new Campaign(cid);
    campaign.cap = ZERO_BI;
    campaign.save();
  }
  return campaign as Campaign;
}

