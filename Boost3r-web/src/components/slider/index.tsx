import { Key, useContext, useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Center,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    Divider,
    Text,
    VStack,
    useDisclosure,
    Spinner,


} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import CAMPAIGN from "src/utils/Campaign.json"
import POAP from "src/utils/PoapNFT.json"
import { ethers } from "ethers";

import { GlobalContext } from "contexts/global";
import { FaChartLine, FaPeopleArrows, FaStar, FaTwitter } from "react-icons/fa";
import Lottie from "lottie-react";
import confetti from "src/utils/congrats.json"








const campaigns: any = [
    {

        image: "https://picsum.photos/seed/picsum/600/400",
    },
    {

        image: "https://picsum.photos/600/400",
    },
    {

        image: "https://picsum.photos/600/400",
    },

];

const Slider = () => {
    const [currentCard, setCurrentCard] = useState(1);
    const { camps, setCamps, account }: any = useContext(GlobalContext);
    const bgColor = "transparent";
    const sliderRef = useRef<any>(null);
    const [onView, setOnView] = useState(false);
    const [index, SetIndex] = useState(0)
    const { onClose } = useDisclosure();
    const [success, setSuccess] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)




    const handleCheckIn = async () => {

        setSubmitting(true)
        try {
            const ethereum = (window as any).ethereum;
            const _provider = new ethers.BrowserProvider(ethereum, { name: "unknown", chainId: 5001 });
            const signer = _provider.getSigner();
            console.log(signer)
            const CampaignContract: any = new ethers.Contract("0x9C78Bd5F681C79e97696e9Ebec8959D5eC87ec22", CAMPAIGN.abi, await signer);
            const pushTx = await CampaignContract.checkIn(index, ethers.ZeroAddress);
            const txxHash = pushTx.hash;
            console.log('Create campaign Transaction sent:', txxHash);
            setSuccess(true)
            //   props.onClose();

        } catch (e) {
            setSubmitting(false)
            console.log(e)
        }
    };
    // useEffect(() => {

    //     if (camps) {
    //         if (campaigns.length > 0) {
    //             for (let i = 0; i < camps.length; i++) {
    //                 let addressArray = [camps[index]["checkedInAddresses"]];
    //                 let address = addressArray[i];
    //                 if (address) {
    //                     if (address.includes(ethers.getAddress(account))) {
    //                         async function fetchNFT() {
    //                             const NFTtokenID = i + 1;
    //                             const ethereum = (window as any).ethereum;
    //                             const _provider = new ethers.BrowserProvider(ethereum, { name: "unknown", chainId: 5001 });
    //                             const signer = _provider.getSigner();
    //                             const POAPContract: any = new ethers.Contract("0x8FaeCCc73e720EDaF5DA087Eb075484f0e1101a6", POAP.abi, await signer)

    //                             // // Call the ERC721 contract's tokenURI() function to get the metadata URI for the token
    //                             // const tokenURI = await POAPContract.tokenURI(NFTtokenID);
    //                             // // Use the metadata URI to retrieve the metadata for the token
    //                             // const metadataResponse = await fetch(tokenURI);
    //                             // console.log(metadataResponse.text());
    //                         }

    //                     }
    //                 }
    //             }
    //         }

    //     }

    // });






    useEffect(() => {

        async function fetchCampaigns() {
            const ethereum = (window as any).ethereum;
            const _provider = new ethers.BrowserProvider(ethereum, { name: "unknown", chainId: 5001 });
            const signer = _provider.getSigner();
            const CampaignContract: any = new ethers.Contract("0x9C78Bd5F681C79e97696e9Ebec8959D5eC87ec22", CAMPAIGN.abi, await signer);

            //Allow contract to transfer BST onbehalf of user from address to itself

            const campaignIds = await CampaignContract.getAllCampaigns();


            // Use Promise.all to fetch the data for each campaign in parallel
            const campaignData = await Promise.all(

                campaignIds.map(async ({ 0: cid, 1: deposit, 2: ended, 3: balance, 4: rewardAmount, 6: checkIns, }: any) => {
                    const res = await fetch(`https://ipfs.infura.io:5001/api/v0/cat?arg=${cid}`, {
                        method: "POST",
                        headers: {
                            Authorization: "Basic " + btoa("2M5MWb0YnyHo9UzoPcl8m6XnQKt:cdc90170d4fa13d0325870442ff11eeb")
                        }
                    });
                    const data = await res.text();
                    const checkedInAddresses = await Promise.all(
                        checkIns.map(async (address: string) => {
                            return address;
                        })
                    );
                    if (checkedInAddresses) {
                        const { title, description }: any = JSON.parse(data);
                        return {
                            title,
                            description,
                            deposit,
                            ended,
                            balance,
                            rewardAmount,
                            checkedInAddresses: checkedInAddresses
                        };
                    }
                })
            );
            console.log(campaignData);

            setCamps(campaignData);

        }

        if (!camps) {
            fetchCampaigns();
        }





    }, [camps])


    const handleNextClick = () => {
        if (camps && camps.length > 0) {
            if (currentCard < camps.length) {
                setCurrentCard(currentCard + 1);
                sliderRef.current.scrollTo({
                    left: sliderRef.current.clientWidth * currentCard,
                    behavior: "smooth",
                });
            }
        }
    };

    const handlePrevClick = () => {
        if (currentCard > 1) {
            setCurrentCard(currentCard - 1);
            sliderRef.current.scrollTo({
                left: sliderRef.current.clientWidth * (currentCard - 2),
                behavior: "smooth",
            });
        }
    };



    return (
        <>
            <Box bg={bgColor} py={4}>
                <Flex justify="center">

                    <Box maxW="600px" mx={4}>
                        <Box
                            borderRadius={24}
                            overflowX="scroll"
                            sx={{
                                "&::-webkit-scrollbar": {
                                    height: "4px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    bg: "#e5559a",
                                    borderRadius: "full",
                                },
                            }}
                            ref={sliderRef}
                        >
                            <Flex>
                                {camps && camps.map((x: any, i: any) => (
                                    <Box key={i} >
                                        <Box

                                            minW="600px"
                                            bg="#1d1f37"
                                            color={"white"}
                                            h="300px"
                                            backgroundImage={`linear-gradient(to left, rgb(29, 31, 55, 1), rgb(29, 31, 55, 1), rgb(29, 31, 55, 1),rgb(29, 31, 55, 1), rgb(29, 31, 55, 1), rgb(29, 31, 55, 0.9),  rgba(29, 31, 55, 0.7), rgba(29, 31, 55, 0.4), rgba(29, 31, 55, 0)),url(${campaigns[i]["image"]})`}

                                            backgroundSize="fill-width"
                                            backgroundRepeat={"no-repeat"}
                                            backgroundPosition="right"
                                        // ml={campaign.id !== 1 ? 0 : 0}
                                        // mr={campaign.id !== campaigns.length ? 0 : 0}
                                        >


                                            <VStack justifyContent={"flex-start"} display="flex" textAlign='right' w="100%" alignItems={"flex-end"} h="100%" p={8}>
                                                <Box w="70%">
                                                    <Center>      <Text fontSize={"sm"}>{x.title}</Text>
                                                    </Center>
                                                    <Center>
                                                        <Text
                                                            py={5}
                                                            fontSize={"xl"}
                                                            fontWeight={700}
                                                            textAlign="center"
                                                        >
                                                            {x.description}
                                                        </Text>
                                                    </Center>
                                                    <Center>
                                                        <Text
                                                            fontSize={"sm"}
                                                            color={"whiteAlpha.700"}
                                                        >
                                                            Running Since 21st Feb

                                                        </Text>
                                                    </Center>

                                                    <Center py={4}>
                                                        <Button onClick={() => {
                                                            SetIndex(i)
                                                            setOnView(true);
                                                        }

                                                        }>Check In</Button>
                                                    </Center>
                                                </Box>

                                            </VStack>


                                        </Box>
                                    </Box>


                                ))}
                            </Flex>
                        </Box>
                    </Box>

                </Flex>
                {
                    camps && camps.length > 0 && (
                        <Flex justifyContent="center" mt={4} alignItems="center">
                            <IconButton
                                bg={"#1d1f37"}
                                aria-label="Previous card"
                                icon={<ChevronLeftIcon />}
                                onClick={handlePrevClick}
                                disabled={currentCard === 1}
                                variant="ghost"
                            />
                            <Text px={4}>
                                {currentCard} of {camps.length}
                            </Text>
                            <IconButton
                                bg={"#1d1f37"}
                                aria-label="Next card"
                                icon={<ChevronRightIcon />}
                                onClick={handleNextClick}
                                disabled={currentCard === camps.length}
                                variant="ghost"
                            />
                        </Flex>
                    )
                }

            </Box>


            <Drawer placement='right' isOpen={onView} onClose={onClose}
            >
                <DrawerOverlay
                    zIndex="tooltip"
                    backgroundColor={"blackAlpha.700"}


                >




                    <Box
                        w={{ base: '100%', lg: '78%' }}
                        left={0}
                        bg={"blackAlpha.800"}

                        top={0}
                        h="100vh"
                    >

                        <Box
                            display='flex'
                            alignItems='center'
                            justifyContent='space-between'
                            p={6}
                            zIndex="tooltip"
                            position="absolute"
                        >
                            <Button
                                bg={"grey"}

                                onClick={() => {

                                }}>  Close</Button>



                        </Box>


                        <Center >
                            <Box w="100%" h="100vh" display={"flex"} flexDirection="column"
                                justifyContent={"center"}
                                alignItems="center"
                            >

                                <Box

                                    minW="600px"
                                    bg="#1d1f37"
                                    color={"white"}
                                    minH="350px"
                                >


                                    {account?.length > 3 && camps && campaigns.length > 0 && (
                                        <>
                                            <Box p={4} flexDir={"column"} alignItems="space-between">

                                                <Flex flexDir={"column"} justifyContent="center">
                                                    <Text fontSize="4xl" fontWeight="bold" textAlign="center">
                                                        {camps[index].title}
                                                    </Text>
                                                    <Text fontSize="lg" fontWeight="bold" textAlign="center">
                                                        {camps[index].description}
                                                    </Text>
                                                </Flex>


                                                {camps[index].checkedInAddresses && camps[index].checkedInAddresses.includes(ethers.getAddress(account)) &&

                                                    <>
                                                        <Flex mt={8}>
                                                            <VStack align="center" flex={1} pr={4} borderRight="1px solid gray">
                                                                <Text fontSize="2xl" fontWeight="bold">
                                                                    0 <span style={{
                                                                        fontSize: "xs",
                                                                        color: "pink",
                                                                        fontWeight: "semibold"
                                                                    }}>BST</span>
                                                                </Text>

                                                                <Text>

                                                                    <span> <FaChartLine /></span> Total Earnings
                                                                </Text>
                                                            </VStack>
                                                            <Divider orientation="vertical" />
                                                            <VStack align="center" flex={1} px={4}>
                                                                <Text fontSize="2xl" fontWeight="bold" textAlign={"center"}>
                                                                    0<span>      <FaPeopleArrows /></span>
                                                                </Text>
                                                                <Text>


                                                                    Referral</Text>
                                                            </VStack>
                                                            <Divider orientation="vertical" />
                                                            <VStack align="center" flex={1} pl={4} borderLeft="1px solid gray">
                                                                <Text fontSize="2xl" fontWeight="bold" color={"whiteAlpha.200"}>
                                                                    null
                                                                </Text>
                                                                <Text>


                                                                    <span>   <FaStar /></span>Score
                                                                </Text>
                                                            </VStack>
                                                        </Flex>

                                                        <HStack py={6} w="100%" alignItems={"center"} justifyContent="center">
                                                            <Button rightIcon={<FaTwitter />}>Tweet</Button>
                                                            <Button>Copy Link</Button>

                                                        </HStack>

                                                    </>
                                                }

                                                {
                                                    camps[index].checkedInAddresses && !camps[index].checkedInAddresses.includes(ethers.getAddress(account)) &&

                                                    (
                                                        success ?
                                                            <>
                                                                <Box bg="blackAlpha.300" position={"absolute"}
                                                                    w="100%"
                                                                    right="30%"
                                                                    top={0}
                                                                >
                                                                    <Center>
                                                                        <Lottie animationData={confetti} loop={true} />
                                                                    </Center>

                                                                </Box>

                                                            </>

                                                            :

                                                            <>
                                                                {submitting && (
                                                                    <>
                                                                        <Center>
                                                                            <VStack w='100%' h='240'>
                                                                                <Spinner />
                                                                                <Text py={3}>Brave new world</Text>
                                                                            </VStack>
                                                                        </Center>
                                                                    </>
                                                                )}

                                                                {!submitting && (
                                                                    <Flex pt={12} flexDirection="column" align="center" justifyContent={"center"} >

                                                                        <Box justifyContent={"center"}
                                                                            textAlign="center"
                                                                            flexDir="column"
                                                                            display={"flex"}
                                                                            w="100%"

                                                                        >


                                                                            <Text
                                                                                color="whiteAlpha.800"
                                                                                px="10%">Check in,  {camps.checkedInAddresses ? camps.checkedInAddresses[index] : null} Refer Others, and Recieve BSTs wheeach time someone you refer checks in
                                                                            </Text>

                                                                        </Box>
                                                                        <Button mt={24} h="48px" bg="#3b3170" alignSelf={"centerf"} w="fit-content"
                                                                            onClick={handleCheckIn}
                                                                            position="absolute"
                                                                            bottom={"30%"}
                                                                            _hover={{
                                                                                bg: "purple"
                                                                            }}
                                                                            zIndex={999999999999999}
                                                                        >
                                                                            CHECK IN
                                                                        </Button>

                                                                    </Flex>
                                                                )}

                                                            </>
                                                    )

                                                }

                                            </Box>






                                        </>
                                    )}



                                </Box>



                            </Box>
                        </Center>

                    </Box>




                    <DrawerContent
                        w={{ base: '100%', lg: '40%' }}
                        py={6}
                        px={3}
                        right={0}
                        bgColor='#1d1f37'

                    >
                        <DrawerHeader
                            background={"#2d3142"}
                            zIndex='tooltip'

                        >
                            <Box
                                display='flex'
                                alignItems='center'
                                justifyContent='space-between'

                            >
                                <Heading
                                    sx={{
                                        color: 'rgb(18, 29, 51',
                                    }}
                                    as='h6'
                                    fontWeight='600'
                                    fontSize='lg'
                                >
                                    Active Campaigns
                                </Heading>

                                <IconButton
                                    size={'md'}
                                    color='grey'
                                    borderRadius='50%'
                                    icon={<Text fontSize={'25px'}>X</Text>}
                                    aria-label={'Open Menu'}
                                    display={['inherit', 'inherit', 'inherit']}
                                    onClick={() => {
                                        setOnView(false)
                                    }}
                                />
                            </Box>

                        </DrawerHeader>

                        <DrawerBody>
                            <Box px={3} w='100%'>
                                <br />
                                <Input
                                    type='text'
                                    w='100%'
                                    py={6}
                                    placeholder='Search By Campaign ID'
                                    borderRadius='15px'
                                />

                                {camps && camps.length > 1 && (
                                    <Box minH='100vh' py={6}>

                                        {
                                            camps.filter((x: any) => x.ended !== true).map((x: any, i: number) => (
                                                <HStack
                                                    key={i}
                                                    w='100%' bg={index === i ? "#3b3170" :
                                                        "blackAlpha.400"


                                                    } justifyContent={'space-between'}
                                                    alignItems="center"

                                                    h="120px" px={6}
                                                    borderRadius={6}
                                                    mb={3}
                                                    cursor={"pointer"}
                                                    onClick={() => {
                                                        SetIndex(i)
                                                    }}
                                                >
                                                    <HStack textAlign={"left"} justify={"start"}>

                                                        <VStack textAlign={"left"} w="100%">
                                                            <Box><Box as="span" color="orange">Title </Box>{x.title}</Box>
                                                            <Box fontSize={"xs"} color="whiteAlpha.600"><Box as="span" color="orange">Reward: </Box>{ethers.formatUnits(x.rewardAmount, 18)}BST {" "}
                                                                per referral
                                                            </Box>
                                                        </VStack>
                                                    </HStack>
                                                </HStack>

                                            ))
                                        }


                                    </Box>
                                )}
                            </Box>
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>

            </Drawer >


        </>
    );
};

export default Slider;





