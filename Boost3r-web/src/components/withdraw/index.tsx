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


function WithdrawTokenModal(props: { isOpen: boolean, onClose: () => void }) {
    const { bst, }: any = useContext(GlobalContext);
    const [amount, setAmount] = useState("");
    const [network, setNetwork] = useState("");
    const [success, setSuccess] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const { onClose } = useDisclosure();

    const handleAmountChange = (event: any) => {
        setAmount(event.target.value);
    };

    const handleNetworkChange = (event: any) => {
        setNetwork(event.target.value);
    };


    const handleSubmit = async () => {

        setSubmitting(true)
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
            console.log('Create campaign Transaction sent:', txxHash);
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
                                <FormLabel>Withdraw WETH To</FormLabel>
                                <Select value={network} onChange={handleNetworkChange}>
                                    <option value="Mantle Testnet">
                                        {/* <Avatar size="xs" mr={2} icon={<FaEthereum />} /> */}
                                        Mantle Testnet
                                    </option>
                                    <option value="Goerli Test">
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
