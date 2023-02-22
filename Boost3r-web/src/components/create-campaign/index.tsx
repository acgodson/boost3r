import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    ModalFooter,
    Text,
    Box,
    VStack,
} from '@chakra-ui/react';
import pinataSDK from '@pinata/sdk';
import { ethers } from 'ethers';
import BSTARTIFACT from "src/utils/L2BSTToken.json"
// import POAP from "src/utils/PoapNFT.json"
import CAMPAIGN from "src/utils/Campaign.json"
import { BsCheckCircle } from 'react-icons/bs';

// PINATA information
const PINATA_API_KEY = 'fd8ae52c28c49866c91d';
const PINATA_API_SECRET =
    'f487fd6d90dcbda86149e5ed1e5b9e5a5053b4056d9f505f9a9a4931a8670cdf';

const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

const CreateCampaignModal = (props: { isOpen: boolean, onClose: () => void; }) => {
    const [name, setName] = useState('');
    const [success, setSuccess] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [description, setDescription] = useState('');
    const [rewardAmount, setRewardAmount] = useState(0.00001);
    const [depositAmount, setDepositAmount] = useState(0.0005);

    const handleSubmit = async () => {

        setSubmitting(true)
        try {

            const metadataObject = {
                title: name,
                description,
            }
            // Add and pin the metadata to IPFS
            const metadataPinned = await pinata.pinJSONToIPFS(
                metadataObject
            );
            const metadataHash = metadataPinned.IpfsHash;
            console.log(metadataHash);

            // Push Contract To blockchain;
            //  QmRYYHGCrPpwpsVav692mNDUz8CukSWCrPkuaUWN98sVAR

            const ethereum = (window as any).ethereum;
            const _provider = new ethers.BrowserProvider(ethereum, { name: "unknown", chainId: 5001 });
            const signer = _provider.getSigner();
            const BSTContract: any = new ethers.Contract("0x6280b9b5Aac7851eF857884b50b86129809aF7Ab", BSTARTIFACT.abi, await signer);
            const CampaignContract: any = new ethers.Contract("0x9C78Bd5F681C79e97696e9Ebec8959D5eC87ec22", CAMPAIGN.abi, await signer);
            const deposit = ethers.parseUnits(depositAmount.toString(), 18);
            const reward = ethers.parseUnits(rewardAmount.toString(), 18);

            //Allow contract to transfer BST onbehalf of user from address to itself
            const appTx = await BSTContract.approve("0x9C78Bd5F681C79e97696e9Ebec8959D5eC87ec22", deposit);
            // Get the transaction hash
            const txHash = appTx.hash;
            console.log('Approval Transaction sent:', txHash);

            const pushTx = await CampaignContract.createCampaign(
                metadataHash,
                deposit,
                reward
            );
            const txxHash = pushTx.hash;
            console.log('Create campaign Transaction sent:', txxHash);
            setSuccess(true)
            //   props.onClose();

        } catch (e) {
            setSubmitting(false)
            console.log(e)
        }
    };


    useEffect(() => {
        if (!props.isOpen) {
            if (!submitting) {
                setSuccess(false);
            }
        }
    }, [props.isOpen])


    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent bg={"#1d1f37"}>
                <ModalHeader>

                    <Box position={"relative"} as="img"
                        h="auto"
                        w="60%"
                        src='/images/create.png'
                        py={2}
                    />

                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>

                    {!submitting && !success && (
                        <>
                            <FormControl isRequired>
                                <FormLabel>Title</FormLabel>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </FormControl>


                            <FormControl isRequired>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel py={2}>Reward Amount

                                    <Box as="span" fontSize={"xs"}> (Fixed)</Box>



                                </FormLabel>
                                <Input
                                    type="number"
                                    value={rewardAmount}
                                    readOnly={true}
                                    onChange={(event) => setRewardAmount(parseInt(event.target.value))}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel py={2}>Deposit Amount


                                    <Box as="span" fontSize={"xs"}> (Fixed)</Box>

                                </FormLabel>
                                <Input
                                    type="number"
                                    value={depositAmount}
                                    readOnly={true}
                                    onChange={(event) => setDepositAmount(parseInt(event.target.value))}
                                />
                            </FormControl>

                        </>
                    )}

                    {success && (
                        <>
                            <VStack w='100%' h='240'>
                                <BsCheckCircle fontSize={'48px'} />
                                <Text py={3}>Campaign Successfully Created</Text>
                            </VStack>
                        </>
                    )}

                </ModalBody>


                {!submitting && !success && (

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Create
                        </Button>
                        <Button onClick={props.onClose}>Cancel</Button>
                    </ModalFooter>
                )}



            </ModalContent>
        </Modal>
    );
};

export default CreateCampaignModal;
