import { Box, Button, Center, Flex, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { GlobalContext } from "contexts/global";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import BSTARTIFACT from "src/utils/L2BSTToken.json";
import WETHARTIFACT from "src/utils/WETH9.json";
import { BsCheckCircle } from "react-icons/bs";
import WithdrawTokenModal from "../withdraw";
import { BST_ADDRESS, WETH_ADDRESS } from "config";






function WalletCard() {
    const { chain, user, balance, account, bst, setBst, bpoap, setBpoap }: any = useContext(GlobalContext);
    const [success, setSuccess] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [amount, setAmount] = useState<number>(0.001);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [bstBalance, setBstBalance] = useState<any | null>(null);
    const [step, setStep] = useState<string>("1")
    const [hash, setHash] = useState(null);
    const [withdrawing, setWithdrawing] = useState(false);


    const handleWithdraw = () => {
        if (withdrawing) {
            setWithdrawing(false)
        } else {
            setWithdrawing(true)
        }

    }
    useEffect(() => {
        console.log(step);
        console.log(hash)
    }, [step, hash])



    async function depositBST() {

        setSubmitting(true);
        try {
            const ethereum = (window as any).ethereum;
            const _provider = new ethers.BrowserProvider(ethereum, { name: "unknown", chainId: 5001 });
            const signer = _provider.getSigner();
            const BSTContract: any = new ethers.Contract(BST_ADDRESS, BSTARTIFACT.abi, await signer);
            const WETHContract: any = new ethers.Contract(WETH_ADDRESS, WETHARTIFACT.abi, await signer);
            const depositAmount = ethers.parseUnits(amount.toString(), 18)
            const bitAllowance = ethers.parseUnits("0.4", 18)

            console.log("deposit aamount", depositAmount);
            //Allow contract to transfer WETH from address to itself
            const appTx = await WETHContract.approve(BST_ADDRESS, bitAllowance);
            appTx.wait();
            // Get the transaction hash
            const txHash = appTx.hash;
            console.log('Transaction sent:', txHash);
            await BSTContract.approve(BST_ADDRESS, bitAllowance);
            const dppTx = await BSTContract.deposit(depositAmount, account);
            const tx2Hash = dppTx.hash;
            console.log('Transaction sent:', tx2Hash);
            setHash(tx2Hash);
            setSubmitting(false);
            setSuccess(true);
            setBstBalance(null);
            //Allow contrance to transfer BST from address to itself
            //await BSTContract.approve("0x6280b9b5Aac7851eF857884b50b86129809aF7Ab", allowanceAmount);


            console.log()
        } catch (e) {
            console.log(e)
            setSubmitting(false)
        }
    }

    //fetch bst balance
    useEffect(() => {
        async function checkBST() {
            const ethereum = (window as any).ethereum;
            const _provider = new ethers.BrowserProvider(ethereum, { name: "unknown", chainId: 5001 });
            const signer = _provider.getSigner();
            const BSTContract: any = new ethers.Contract(BST_ADDRESS, BSTARTIFACT.abi, await signer)
            const balance = await BSTContract.balanceOf(account);
            const decimals = 18; // Replace with the number of decimal places used by the token
            const balanceFormatted = ethers.formatUnits(balance, decimals);
            console.log("BST balance", balanceFormatted);
            setBst(balanceFormatted);

        }
        if (user && account) {
            if (!bstBalance) {
                checkBST()

            }
        }
    })


    //fetch bpoap amount
    useEffect(() => {

        const abi = [
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "balance",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_index",
                        "type": "uint256"
                    }
                ],
                "name": "tokenOfOwner",
                "outputs": [
                    {
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ]



        async function checkBPoap() {
            const ethereum = (window as any).ethereum;
            const _provider = new ethers.BrowserProvider(ethereum, { name: "unknown", chainId: 5001 });
            const signer = _provider.getSigner();
            const POAPContract: any = new ethers.Contract("0x8FaeCCc73e720EDaF5DA087Eb075484f0e1101a6", abi, await signer)
            const balance = await POAPContract.balanceOf(account);
            const balanceFormatted = ethers.formatUnits(balance, 0);
            console.log("BST balance", balanceFormatted);
            console.log("POAP NFT balance", balanceFormatted);
            setBpoap(balanceFormatted);
        }
        if (account) {
            if (!bpoap) {
                checkBPoap()

            }
        }
    })





    useEffect(() => {
        if (!isOpen) {
            if (!submitting) {
                setSuccess(false);
            }
        }
    }, [isOpen])





    return (
        <>
            <Flex
                bg="#1d1f3780"
                boxShadow="lg"
                p={4}
                borderRadius="md"
                align="center"
                justify="space-between"
                flexDirection="column"
            >
                {/* <Text fontSize="lg" fontWeight="bold">
                Active Wallet
            </Text> */}

                <Box position={"relative"} as="img"
                    h="auto"
                    w="60%"
                    src='/images/active.png'
                    py={2}
                />

                <Text pt={1} fontSize="sm" mb={4} color={"#e5559a"}>

                    {
                        account ?

                            account.slice(0, 6) +
                            "..." +
                            account.slice(account.length - 4)
                            : "not connected"
                    }
                    {account && <IconButton
                        h="21px"
                        w="21px"
                        aria-label="Copy Wallet Address"
                        icon={<CopyIcon
                            color="white"

                        />}
                        ml={2}
                    />}
                </Text>
                <Flex justify="space-between" w="100%">
                    <Flex direction="column">
                        <Text fontSize="sm" color="gray.500" mb={2}>
                            BST Balance
                        </Text>
                        <Text fontSize="xl" fontWeight="bold">
                            {account && chain === 5001n ? bst :
                                0} BST
                        </Text>
                    </Flex>
                    <Flex direction="column">
                        <Text fontSize="sm" color="gray.500" mb={2}>
                            BIT Balance
                        </Text>
                        <Text fontSize="xl" fontWeight="bold">
                            {account && chain === 5001n ? balance :
                                0} BIT
                        </Text>
                    </Flex>
                </Flex>
                <Flex alignItems={"center"} justifyContent="space-around" mt={4}>
                    <Button colorScheme={account && chain === 5001n ? "green" : "gray"}
                        disabled={
                            account && chain === 5001n ?
                                false : true}
                        onClick={
                            user && account && chain === 5001n ? () => {
                                setStep("1"); onOpen();
                            } : () => { }

                        }
                    >
                        FUND
                    </Button>
                    <Button colorScheme={account && chain === 5001n ? "red" : "gray"} ml={5}
                        disabled={account && chain === 5001n ? false : true}
                        onClick={
                            user && account && chain === 5001n ?
                                () => setWithdrawing(true) : () => { }
                        }
                    >
                        Withdraw
                    </Button>
                </Flex>
            </Flex>


            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent bg="#2d3142" color="whitesmoke">
                    <ModalHeader>
                        Deposit  WETH for BST
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {!submitting && !success && (
                            <>
                                <Stack
                                    direction={['column', 'column', 'row']}
                                    w='100%'
                                    spacing={4}
                                >
                                    <Box>

                                        {/* <Text fontSize={'xs'} py={2}>
                                            WETH Balance: <span color="pink">{wethBalance}</span>WETH
                                        </Text> */}

                                        <Box w="100%" display={"flex"} justifyContent="space-between">
                                            <Text fontSize={'xs'} py={2}>
                                                Deposit Amount
                                            </Text>
                                            <Text fontSize={'xs'} py={2} cursor="pointer" color={"pink"}>
                                                Max
                                            </Text>
                                        </Box>
                                        <Input
                                            borderRadius={'12px'}
                                            maxLength={8}
                                            type='number'
                                            value={amount}
                                            h={'48px'}
                                            w='100%'
                                            placeholder='Unit Name'
                                            onChange={(e) => setAmount(parseInt(e.target.value))}

                                        />



                                    </Box>


                                </Stack>
                            </>
                        )}

                        {submitting && !success && (
                            <>
                                <Center>
                                    <VStack w='100%' h='240'>
                                        <Spinner />
                                        <Text py={3}>Brave new world</Text>
                                    </VStack>
                                </Center>
                            </>
                        )}

                        {success && (
                            <>
                                <VStack w='100%' h='240'>
                                    <BsCheckCircle fontSize={'48px'} />
                                    <Text py={3}>Booster Account Funded</Text>
                                </VStack>
                            </>
                        )}
                    </ModalBody>

                    {!submitting && !success && (
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={depositBST}>
                                Approve
                            </Button>
                            <Button variant='ghost' onClick={() => { }}
                                color="gray"
                                _hover={{
                                    bgColor: "transparent"
                                }}
                            >
                                Deposit
                            </Button>
                        </ModalFooter>
                    )}
                </ModalContent>
            </Modal>

            <WithdrawTokenModal isOpen={withdrawing} onClose={handleWithdraw} />



        </>
    );
}

export default WalletCard;
