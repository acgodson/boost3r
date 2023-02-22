This is a Solidity Smart Contract for the Boost3r Affliate Marketing Platform. It consists of three contracts: `PoapNFT`, `Boost3rToken`, and `Campaign`.

## PoapNFT Contract

- Inherits from the `ERC721` contract in the [OpenZeppelin library](), which implements the ERC-721 standard for non-fungible tokens (NFTs).

- The PoapNFT contract has a `mint` function for minting new NFTs, an `addReferral` function for adding referral counts to an existing NFT, and a `totalSupply` function for returning the total number of NF Ts minted.

- The PoapNFT represents participation in any campaign, and contains a metadata (an IPFS cid).

## Boost3rTOKEN Contract

This contract is a standard ERC20 token contract with the additional functionality of depositing and withdrawing tokens using the BIT token as a collateral.

- The contract imports the ERC20 and IERC20 interfaces from OpenZeppelin, and the L2StandardERC20 interface from Mantle, which is used to represent the BitToken, the collateral token in this contract.

- The receive and fallback functions are both used to reject any direct ether deposits to the contract.

- The deposit function allows users to deposit the Bit as collateral and mint L2BST tokens. The function first checks that the amount to deposit is greater than 0 and then uses the transferFrom function from the BIT Contract to transfer the specified amount from the user's address to the contract's address.

- The number of L2BST tokens to mint using the exchangeRate variable and adds those tokens to the user's balance.

- The withdraw function allows users to withdraw BIT by burning the corresponding number of L2BST tokens. The function first checks that the user has enough L2BST tokens to withdraw and then calculates the amount of BitToken to return using the exchangeRate.

## Campaign Contract

- Allows organizers to create campaigns by depositing a specified number of Boost3rTokens.

- Users who participate in the campaign check in to recieve a PoapNFT

- If particpants they refer another attendee who checks in successfully, they receive a reward in Boost3rtokens.

## Usage

The contract can be tested and deployed in a hardhat development environment

```bash
# Compile Contracts
npx hardhat compile

# Run tests in the test folder
npx hardhat test

```

## Author

Godson Ani

## License

[MIT]()

## Useful Addresses

- L2 Brost3rToken Address: 0x6287487E7DfDBa2ba1A6190Cc9e3Fe24551f3CBb
- L2 POAP NFT: 0xaC73d85d10f8984B46E532C7a8707EC8B3486e1f
