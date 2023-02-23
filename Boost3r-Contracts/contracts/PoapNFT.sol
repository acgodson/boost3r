// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract PoapNFT is ERC721Enumerable {
    struct Event {
        uint256 eventId;
        string cid;
        uint256 totalReferrals;
    }

    mapping(uint256 => Event) events;
    uint256 public freeTokens;
    uint256 public totalMinted;
    uint256 public lastMintedTokenId;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _freeTokens
    ) ERC721(_name, _symbol) {
        freeTokens = _freeTokens;
    }

    function mint(
        address _to,
        uint256 _eventId,
        string memory _cid
    ) public {
        require(!_exists(_eventId), "Event already exists");
        _safeMint(_to, _eventId);
        events[_eventId] = Event(_eventId, _cid, 0);
        totalMinted++;
        lastMintedTokenId = _eventId;
    }

    function addReferral(uint256 _eventId, uint256 _referrals) public {
        require(_exists(_eventId), "Event does not exist");
        events[_eventId].totalReferrals += _referrals;
    }

    function getEvent(uint256 eventId)
        public
        view
        returns (string memory cid, uint256 totalReferrals)
    {
        require(_exists(eventId), "Event does not exist");
        Event storage tt = events[eventId];
        return (tt.cid, tt.totalReferrals);
    }

    function totalSupply() public view override returns (uint256) {
        return totalMinted;
    }

    function getLastMintedEventId() public view returns (uint256) {
        return lastMintedTokenId;
    }

    function tokensOfOwner(address owner)
        external
        view
        returns (TokenDetails[] memory)
    {
        uint256 tokenCount = balanceOf(owner);

        if (tokenCount == 0) {
            return new TokenDetails[](0);
        } else {
            TokenDetails[] memory result = new TokenDetails[](tokenCount);
            for (uint256 i = 0; i < tokenCount; i++) {
                (
                    uint256 eventId,
                    string memory cid,
                    uint256 totalReferrals
                ) = tokenDetailsByIndex(owner, i);
                result[i] = TokenDetails(eventId, cid, totalReferrals);
            }
            return result;
        }
    }

    function tokenDetailsByIndex(address owner, uint256 index)
        public
        view
        returns (
            uint256 eventId,
            string memory cid,
            uint256 totalReferrals
        )
    {
        require(index < balanceOf(owner), "Owner index out of bounds");

        eventId = tokenOfOwnerByIndex(owner, index);
        Event storage eventDetails = events[eventId];
        cid = eventDetails.cid;
        totalReferrals = eventDetails.totalReferrals;
    }

    struct TokenDetails {
        uint256 eventId;
        string cid;
        uint256 totalReferrals;
    }
}
