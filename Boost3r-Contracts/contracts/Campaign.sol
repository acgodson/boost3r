// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./L2BSTToken.sol";
import "./PoapNFT.sol";

contract Campaign {
    struct CampaignInfo {
        string cid;
        uint256 deposit;
        bool ended;
        uint256 balance;
        uint256 rewardAmount;
        uint256[] poapTokenIds;
        address[] checkIns;
    }

    L2BSTToken public l2BSTToken;
    PoapNFT public poapNft;
    address public owner;
    CampaignInfo[] public campaigns;

    mapping(uint256 => address) public poapNftOwners;
    mapping(uint256 => uint256) public poapNftReferralCounts;

    event CampaignCreated(uint256 campaignId);
    event CampaignEnded(uint256 campaignId, uint256 balance);
    event CampaignCheckedIn(
        uint256 campaignId,
        address attendee,
        address referrer
    );

    constructor() {
        l2BSTToken = L2BSTToken(
            payable(address(0x6280b9b5Aac7851eF857884b50b86129809aF7Ab))
        );
        owner = msg.sender;
        poapNft = PoapNFT(address(0x8FaeCCc73e720EDaF5DA087Eb075484f0e1101a6));
    }

    function createCampaign(
        string memory _cid,
        uint256 _deposit,
        uint256 _rewardAmount
    ) public payable returns (uint256) {
        require(_rewardAmount > 0, "Reward amount must be greater than 0");
        require(
            _deposit >= _rewardAmount,
            "Deposit must be greater than or equal to reward amount"
        );

        require(
            l2BSTToken.balanceOf(msg.sender) >= _deposit,
            "Insufficient balance to create campaign"
        );
        require(
            l2BSTToken.transferFrom(msg.sender, address(this), _deposit),
            "Failed to transfer tokens to campaign contract"
        );

        CampaignInfo memory newCampaign = CampaignInfo({
            cid: _cid,
            deposit: _deposit,
            ended: false,
            balance: _deposit,
            rewardAmount: _rewardAmount,
            checkIns: new address[](0),
            poapTokenIds: new uint256[](0)
        });

        campaigns.push(newCampaign);

        emit CampaignCreated(campaigns.length - 1);

        return campaigns.length - 1;
    }

    function checkIn(uint256 _campaignId, uint256 _referralPoapTokenId) public {
        require(!campaigns[_campaignId].ended, "The campaign has ended");

        address checkInAddress = msg.sender;

        // Check if this address has already checked in
        bool alreadyCheckedIn = false;
        for (uint256 i = 0; i < campaigns[_campaignId].checkIns.length; i++) {
            if (campaigns[_campaignId].checkIns[i] == checkInAddress) {
                alreadyCheckedIn = true;
                break;
            }
        }
        require(!alreadyCheckedIn, "You have already checked in");

        if (_referralPoapTokenId == 0) {
            // If the user doesn't have a referrer, mint a new PoapNFT and transfer to the user
            uint256 tokenId = poapNft.totalSupply() + 1;
            poapNft.mint(checkInAddress, tokenId, campaigns[_campaignId].cid);
            campaigns[_campaignId].poapTokenIds.push(tokenId);


            poapNftOwners[tokenId] = checkInAddress;
        } else {
            // If the user has a referrer, confirm that the poapTokenId exists in the array of poapTokenIds
            require(
                poapNftOwners[_referralPoapTokenId] != address(0),
                "Invalid referrer token ID"
            );

            // Mint a new PoapNFT and transfer to the user
            uint256 tokenId = poapNft.totalSupply() + 1;
            poapNft.mint(checkInAddress, tokenId, campaigns[_campaignId].cid);
            campaigns[_campaignId].poapTokenIds.push(tokenId);
            poapNftOwners[tokenId] = checkInAddress;

            // Get the owner of the referrer PoapNFT and reward them with Brows3rToken
            address referrer = poapNftOwners[_referralPoapTokenId];
            uint256 rewardAmount = campaigns[_campaignId].rewardAmount;
            require(
                l2BSTToken.balanceOf(address(this)) >= rewardAmount,
                "Not enough reward tokens available"
            );
            require(
                l2BSTToken.transfer(referrer, rewardAmount),
                "Failed to transfer reward tokens to referrer"
            );

            // Update the referral count of the referrer PoapNFT
            uint256 referralCount = poapNftReferralCounts[
                _referralPoapTokenId
            ] + 1;
            poapNftReferralCounts[_referralPoapTokenId] = referralCount;
            poapNft.addReferral(_referralPoapTokenId, referralCount);
        }

        // Add the user to the list of check-ins for this campaign
        campaigns[_campaignId].checkIns.push(checkInAddress);

        // If the campaign has ended, transfer the balance back to the campaign owner
        if (campaigns[_campaignId].balance == 0) {
            address payable campaignOwner = payable(owner);
            campaignOwner.transfer(campaigns[_campaignId].deposit);
            campaigns[_campaignId].ended = true;
            emit CampaignEnded(_campaignId, campaigns[_campaignId].balance);
        } else {
            // Update the balance of the campaign
            campaigns[_campaignId].balance -= 1;
        }

        emit CampaignCheckedIn(
            _campaignId,
            checkInAddress,
            poapNftOwners[_referralPoapTokenId]
        );
    }

    function endCampaign(uint256 _campaignId) public {
        require(msg.sender == owner, "Only owner can end campaign");
        require(!campaigns[_campaignId].ended, "Campaign has already ended");

        campaigns[_campaignId].ended = true;
        uint256 balance = campaigns[_campaignId].balance;
        if (balance > 0) {
            require(
                l2BSTToken.transfer(owner, balance),
                "Failed to transfer remaining tokens to owner"
            );
        }
        emit CampaignEnded(_campaignId, balance);
    }

    function getAllCampaigns() public view returns (CampaignInfo[] memory) {
        return campaigns;
    }
}
