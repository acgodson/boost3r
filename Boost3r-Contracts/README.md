This is a Solidity Smart Contract for the Boost3r Affliate Marketing Platform. It consists of three contracts: `PoapNFT`, `Boost3rToken`, and `Campaign`.

| Contract | Standard | Address                                     |
| -------- | -------- | ------------------------------------------- |
| BST      | ERC20    | 0x6280b9b5Aac7851eF857884b50b86129809aF7Ab  |
| BPOAP    | ERC721   | 0x8FaeCCc73e720EDaF5DA087Eb075484f0e1101a6  |
| Campaign | -        | 0x9C78Bd5F681C79e97696e9Ebec8959D5eC87ec22F |

[See Updated Addresses](https://boost3r.web.app)

## PoapNFT Contract

- Inherits from the `ERC721` contract in the [OpenZeppelin library](), which implements the ERC-721 standard for non-fungible tokens (NFTs).

- The PoapNFT contract has a `mint` function for minting new NFTs, an `addReferral` function for adding referral counts to an existing NFT, and a `totalSupply` function for returning the total number of NF Ts minted.

- The PoapNFT represents participation in any campaign, and contains a metadata (an IPFS cid).

## Boost3rTOKEN Contract

- This contract is a standard ERC20 token contract with the additional functionality of depositing and withdrawing tokens using the WETH9 token as a collateral.

- The contract imports the ERC20 interface from OpenZeppelin, WETH9 from mantle, and has a fixed exchange rate of 1 to WETH

- The deposit function allows users to deposit the WETH as collateral and mint L2BST tokens. The function first checks that the amount to deposit is greater than 0 and then uses the transferFrom function from the WETH9 Contract to transfer the specified amount from the user's address to the contract's address.

- The withdraw function allows users to withdraw WETH by burning the corresponding number of L2BST tokens. The function first checks that the user has enough BDT tokens to withdraw

## Campaign Contract

- Allows organizers to create campaigns by depositing a specified number of BST.

- Users who participate in the campaign check in to recieve a PoapNFT

- If particpants they refer another attendee who checks in successfully, they receive a reward in BST on behalf of the creator of the campaign.

## Contract Addres

## Usage

This contract was compiles and deployed in a hardhat development environment

```bash
# Compile Contracts
npx hardhat compile

# Run tests in the test folder
npx hardhat test

```

## License

[MIT]()

## Author

Godson Ani
