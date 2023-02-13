import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  EventClaim,
  EventClaimBatch,
  EventClaimBatchCapped,
  EventClaimCapped,
  EventForge
} from "../generated/SpaceStationV2/SpaceStationV2"
import {
  StarNFT as StarNFTTemplate
} from "../generated/templates"
import { 
  StarNFT,
  NFT,
  ClaimRecord
} from "../generated/schema"
import {
  TWO_BI,
  ZERO_BI,
  EventModel,
  NFTModel,
  createSpaceStation,
  createCampaign
} from "./helper"

function handleClaim(
  event: EventModel,
  claim_nft: NFTModel,
): void {
  let campaign_id = claim_nft.campaignID;
  let user = claim_nft.user;
  let nft_contract = claim_nft.nftContract;

  // log.debug("campaign_id:, user: ", user);

  let starNFT = StarNFT.load(nft_contract.toHexString());
  if (starNFT === null) {
    // create template
    StarNFTTemplate.create(nft_contract);
    starNFT = new StarNFT(nft_contract.toHexString());
    starNFT.save();
  }

  let spaceStation = createSpaceStation(event.spaceStationAddr.toHexString(), TWO_BI);
  let campaign = createCampaign(campaign_id.toString());


  for (let i = 0; i < claim_nft.nftIDs.length; i++) {
    let nft_id = claim_nft.nftIDs[i];
    let verify_id = claim_nft.verifyIDs[i];
    let nft_model_id = nft_contract.toHexString().concat("-").concat(nft_id.toString());
    // nft
    let nft = new NFT(nft_model_id);
    nft.number = nft_id;
    nft.starNFT = starNFT.id;
    nft.owner = user;
    nft.campaign = campaign.id;
    nft.save();

    // claim record
    let claim = new ClaimRecord(verify_id.toString());
    claim.nft = nft.id;
    claim.spacestation = spaceStation.id;
    claim.verifyID = verify_id;
    claim.cid = campaign_id;
    claim.user = user;
    // claim.cap = ZERO_BI;
    claim.tx = event.txHash;
    claim.block = event.block;
    claim.timestamp = event.timestamp;
    claim.save();
  }
}

export function handleEventClaimBatch(event: EventClaimBatch): void {
  let em = new EventModel();
  em.spaceStationAddr = event.address;
  em.block = event.block.number;
  em.txHash = event.transaction.hash;
  em.logIndex = event.logIndex;
  em.timestamp = event.block.timestamp;

  let nm = new NFTModel();
  nm.campaignID = event.params._cid;
  nm.user = event.params._sender;
  nm.verifyIDs = event.params._dummyIdArr;
  nm.nftIDs = event.params._nftIDArr;
  nm.nftContract = event.params._starNFT;

  log.info("--> V2 ClaimBatch {}", [event.address.toHexString()]);

  handleClaim(em, nm);
}


export function handleEventClaim(event: EventClaim): void {
  let em = new EventModel();
  em.spaceStationAddr = event.address;
  em.block = event.block.number;
  em.txHash = event.transaction.hash;
  em.logIndex = event.logIndex;
  em.timestamp = event.block.timestamp;

  let nm = new NFTModel();
  nm.campaignID = event.params._cid;
  nm.user = event.params._sender;
  nm.verifyIDs = [event.params._dummyId];
  nm.nftIDs = [event.params._nftID];
  nm.nftContract = event.params._starNFT;

  log.info("--> V2 Claim {}", [event.address.toHexString()]);

  handleClaim(em, nm);
}

export function handleEventClaimBatchCapped(
  event: EventClaimBatchCapped
): void {
  let em = new EventModel();
  em.spaceStationAddr = event.address;
  em.block = event.block.number;
  em.txHash = event.transaction.hash;
  em.logIndex = event.logIndex;
  em.timestamp = event.block.timestamp;

  let nm = new NFTModel();
  nm.campaignID = event.params._cid;
  nm.user = event.params._sender;
  nm.verifyIDs = event.params._dummyIdArr;
  nm.nftIDs = event.params._nftIDArr;
  nm.nftContract = event.params._starNFT;

  log.info("--> V2 ClaimBatchCapped {}", [event.address.toHexString()]);

  handleClaim(em, nm);
}

export function handleEventClaimCapped(event: EventClaimCapped): void {
  let em = new EventModel();
  em.spaceStationAddr = event.address;
  em.block = event.block.number;
  em.txHash = event.transaction.hash;
  em.logIndex = event.logIndex;
  em.timestamp = event.block.timestamp;

  let nm = new NFTModel();
  nm.campaignID = event.params._cid;
  nm.user = event.params._sender;
  nm.verifyIDs = [event.params._dummyId];
  nm.nftIDs = [event.params._nftID];
  nm.nftContract = event.params._starNFT;
  
  log.info("--> V2 ClaimCapped {}", [event.address.toHexString()]);

  handleClaim(em, nm);
}

export function handleEventForge(event: EventForge): void {
  let em = new EventModel();
  em.spaceStationAddr = event.address;
  em.block = event.block.number;
  em.txHash = event.transaction.hash;
  em.logIndex = event.logIndex;
  em.timestamp = event.block.timestamp;

  let nm = new NFTModel();
  nm.campaignID = event.params._cid;
  nm.user = event.params._sender;
  nm.verifyIDs = [event.params._dummyId];
  nm.nftIDs = [event.params._nftID];
  nm.nftContract = event.params._starNFT;
  
  log.info("--> V2 Forge {}", [event.address.toHexString()]);

  handleClaim(em, nm);
}
