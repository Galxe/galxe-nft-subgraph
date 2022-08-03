import { BigInt, log, Address } from "@graphprotocol/graph-ts"
import {
  EventClaim,
  EventClaimBatch,
  EventForge
} from "../generated/SpaceStationV1/SpaceStationV1"
import {
  StarNFT as StarNFTTemplate
} from "../generated/templates/StarNFT/StarNFT"
import { 
  StarNFT,
  NFT,
  NFTMintTransaction,
  ClaimRecord,
} from "../generated/schema"
import {
  ONE_BI,
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

  let mintTx = NFTMintTransaction.load(event.txHash.toHexString());
  if (mintTx == null) {
    log.error("MintTx Not Found {} {}", [claim_nft.nftContract.toHexString(), event.txHash.toHexString()]);
    return;
  }
  let nft_contract = mintTx.nftContract as Address;

  let starNFT = StarNFT.load(nft_contract.toHexString());
  if (starNFT === null) {
    // create template
    StarNFTTemplate.bind(nft_contract);
    starNFT = new StarNFT(nft_contract.toHexString());
    starNFT.save();
  }

  let spaceStation = createSpaceStation(event.spaceStationAddr.toHexString(), ONE_BI);
  let campaign = createCampaign(campaign_id.toString());


  for (let i = 0; i < claim_nft.nftIDs.length; i++) {
    let nft_id = claim_nft.nftIDs[i];
    let verify_id = claim_nft.verifyIDs[i];
    let nft_model_id = nft_contract.toHexString().concat("-").concat(event.logIndex.toString());
    // nft
    let nft = new NFT(nft_model_id);
    nft.number = nft_id;
    nft.starNFT = starNFT.id;
    nft.owner = user;
    nft.campaign = campaign.id;
    nft.save();

    // claim record
    let claim = new ClaimRecord(nft_model_id);
    claim.nft = nft.id;
    claim.spacestation = spaceStation.id;
    claim.verifyID = verify_id;
    claim.cid = campaign_id;
    claim.user = user;
    claim.cap = ZERO_BI;
    claim.tx = event.txHash;
    claim.block = event.block;
    claim.timestamp = event.timestamp;
    claim.save();
  }
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
  
  nm.verifyIDs = new Array<BigInt>();
  nm.verifyIDs.push(event.params._dummyId);
  
  nm.nftIDs = new Array<BigInt>();
  nm.nftIDs.push(event.params._nftID);

  log.debug("--> V1 Claim {}", [event.address.toHexString()]);

  handleClaim(em, nm);
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

  log.debug("--> V1 ClaimBatch {}", [event.address.toHexString()]);

  handleClaim(em, nm);
}

export function handleEventForge(event: EventForge): void {}
