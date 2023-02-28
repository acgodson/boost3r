import { useContext, useState } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Select,
    Box,
    useDisclosure,
    ModalCloseButton,
    Center,
    Slide,
    Spinner,
} from "@chakra-ui/react";
import { GlobalContext } from "contexts/global";
import { ethers } from "ethers"
import BSTARTIFACT from "src/utils/L2BSTToken.json"
import Lottie from "lottie-react";
import confetti from "src/utils/congrats.json"
// import confetti from "src/utils/congrats.json"
// import mantleSDK, { SignerOrProviderLike } from "@mantleio/sdk";
// import Decimal from 'decimal.js';




function WithdrawTokenModal(props: { isOpen: boolean, onClose: () => void }) {
    const { bst }: any = useContext(GlobalContext);
    const [amount, setAmount] = useState("");
    const [network, setNetwork] = useState("");
    const [success, setSuccess] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    // const [testnet, setTestnet] = useState("mantel testnet")
    const { onClose } = useDisclosure();
    // const [crossChainMessenger, setCrossChainMessenger] = useState<
    //     CrossChainMessenger
    // >();

    const handleAmountChange = (event: any) => {
        setAmount(event.target.value);
    };

    const handleNetworkChange = (event: any) => {
        setNetwork(event.target.value);
    };





    // async function withdrawL1() {

    //     const ethereum = (window as any).ethereum;
    //     //   const _l1provider = new ethers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    //     //  const _l2provider = new ethers.JsonRpcProvider("https://rpc.testnet.mantle.xyz");
    //     const _l1provider = new ethers.BrowserProvider(ethereum, { name: "Goerli test network", chainId: 5 });
    //     const _l2provider = new ethers.BrowserProvider(ethereum, { name: "unknown", chainId: 5001 });
    //     const l1Signer = await _l1provider.getSigner();
    //     async function switchNetwork() {
    //         // Switch to the specified network
    //         try {
    //             await ethereum.request({
    //                 method: 'wallet_switchEthereumChain',
    //                 params: [{
    //                     chainId: "0x5",
    //                     // rpcUrls: ["https://rpc.testnet.mantle.xyz"],
    //                 }],
    //                 nativeCurrency: {
    //                     name: "Goerli test network",
    //                     symbol: "GoerliETH",
    //                     decimals: 18
    //                 },
    //                 blockExplorerUrls: ["https://goerli.etherscan.io"]
    //             });


    //         } catch (error) {
    //             console.error(error);
    //             // If the user doesn't switch networks, you can show an error message here
    //             return;
    //         }
    //     }
    //     await switchNetwork();

    //     const l2Signer = await _l2provider.getSigner();

    //     console.log(l1Signer)



    //     const l1wallet: any = l1Signer.provider;
    //     const l2wallet: any = l2Signer.provider

    //     console.log("l1signer", l1Signer);
    //     console.log("l2Signer", l2Signer);


    //     const crossChainMessenger = new CrossChainMessenger({
    //         l1ChainId: 5,
    //         l2ChainId: 5001,
    //         l1SignerOrProvider: l1wallet,
    //         l2SignerOrProvider: l2wallet
    //     });


    //     //const eth = ethers.formatUnits(amount, 18)
    //     const num: any = new Decimal(amount);
    //     const eth = BigInt(num.times(1e18).toFixed());
    //     const multiplied = num.times(1000000);
    //     console.log(multiplied.toString()); // "0.01"

    //     const response = await crossChainMessenger.l2Signer.depositETH(eth)
    //     console.log(`Transaction hash (on L1): ${response.hash}`)
    //     await response.wait()
    //     console.log("Waiting for status to change to RELAYED");
    //     await crossChainMessenger.waitForMessageStatus(response, mantleSDK.MessageStatus.RELAYED)




    // }

    // //    setSubmitting(true)
    // withdrawL1();






    const handleSubmit = async () => {


        try {

            const ethereum = (window as any).ethereum;
            const _provider = new ethers.BrowserProvider(ethereum, { name: "unknown", chainId: 5001 });
            const signer = _provider.getSigner();
            const BSTContract: any = new ethers.Contract("0x6280b9b5Aac7851eF857884b50b86129809aF7Ab", BSTARTIFACT.abi, await signer);
            //Allow contract to transfer BST onbehalf of user from address to itself
            const depositAmount = ethers.parseUnits(amount, 18)
            const appTx = await BSTContract.approve("0x3a55e2fDB61012108B07754243066d912B4c5F50", depositAmount);
            // Get the transaction hash
            const txHash = appTx.hash;
            console.log('Approval Transaction sent:', txHash);
            const pushTx = await BSTContract.withdraw(depositAmount);
            const txxHash = pushTx.hash;
            console.log('Withdrawal Transaction sent at:', txxHash);

            // if (network !== "Mantle Testnet") {
            //     setTimeout(() => {
            //         //It's time to  withdraw via the mantle crossbridge

            //         //This would allow the tokens to be withdrawn to layer 1
            //         withdrawL1();
            //     }, 3000)
            // }



            setSuccess(true)
            props.onClose();

        } catch (e) {
            setSubmitting(false)
            console.log(e)
        }
    };


    return (
        <Modal isOpen={props.isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="#1d1f37">
                <ModalHeader>
                    <Box position={"relative"} as="img"
                        h="auto"
                        w="60%"
                        src='/images/withdraw.png'
                        py={2}
                    />

                </ModalHeader>
                <ModalCloseButton onClick={props.onClose} />
                <ModalBody>


                    {
                        success && (
                            <>
                                <Box bg="blackAlpha.300" position={"fixed"}
                                    w="100%"
                                    right={0}
                                    top={0}
                                >
                                    <Center>
                                        <Lottie animationData={confetti} loop={true} />
                                    </Center>

                                </Box>

                                <Slide direction='bottom' in={success} style={{ zIndex: 10 }}>
                                    <Box
                                        p='40px'
                                        color='white'
                                        mt='4'
                                        bg='teal.500'
                                        rounded='md'
                                        shadow='md'
                                    >
                                        Withrawal is on its way

                                    </Box>
                                </Slide>
                            </>
                        )}



                    {!submitting && !success && (
                        <>
                            <FormControl>
                                <FormLabel>BST Token Balance</FormLabel>
                                <Input value={bst} isReadOnly />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Withdrawal Amount</FormLabel>
                                <Input type="text" value={amount} onChange={handleAmountChange} />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Recieve WETH to</FormLabel>
                                <Select value={network} onChange={handleNetworkChange}>
                                    <option value="Mantle Testnet">
                                        {/* <Avatar size="xs" mr={2} icon={<FaEthereum />} /> */}
                                        Mantle Testnet
                                    </option>
                                    <option value="Goerli Test" disabled>
                                        {/* <Avatar size="xs" mr={2} icon={<FaEthereum />} /> */}
                                        Goerli Test
                                    </option>
                                </Select>
                            </FormControl>
                        </>
                    )}



                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSubmit} w="100%" h="52px">
                        {submitting
                            ? <Spinner /> : "Submit"
                        }

                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default WithdrawTokenModal;
