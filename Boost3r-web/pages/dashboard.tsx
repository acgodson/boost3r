// import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
// import { usePrivy } from '@privy-io/react-auth';
import PageLayout from 'src/components/page-layout';
import Sidebar from 'src/components/sidebar';
import { Box, Button, Center, Flex, Grid, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useBreakpointValue, useToast, VStack } from '@chakra-ui/react';
import Header from 'src/components/header';
import Slider from 'src/components/slider';
import { FiPlay } from 'react-icons/fi';
import WalletCard from 'src/components/wallet';
import ProfileCard from 'src/components/profile';
import { ethers } from 'ethers';
import { getAuth, signInWithPopup, TwitterAuthProvider } from 'firebase/auth';
import { GlobalContext } from 'contexts/global';
import CreateCampaignModal from 'src/components/create-campaign';



const auth = getAuth();
const tProvider = new TwitterAuthProvider();

export default function DashboardPage() {

  const smVariant = { navigation: 'drawer', navigationButton: true }
  const mdVariant = { navigation: 'sidebar', navigationButton: false }
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const variants: any = useBreakpointValue({ base: smVariant, md: mdVariant })
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [creating, setCreating] = useState(false);
  const toast = useToast();
  const [connect, setConnect] = useState(false)
  const {

    mapUserData,
    setUserCookie,
    setTwitterAuthCredential,
    setTwitterProvider,
    setConnected,
    setProvider,
    setAccount,
    connected,
    twitterProvider,
    setChain,
    user,
    setBalance }: any = useContext(GlobalContext);
  const userObject = !twitterProvider ? null : twitterProvider;


  async function signInWithTwitter() {
    try {
      signInWithPopup(auth, tProvider)
        .then(async (result: any) => {
          const credential: any = TwitterAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const secret = credential.secret;
          const TwitterAuthOBJ = {
            credential: credential,
            token: token,
            secret: secret,
          };

          if (TwitterAuthOBJ) {
            localStorage.setItem("twit", JSON.stringify(TwitterAuthOBJ));
            setTwitterAuthCredential(TwitterAuthOBJ);
          }
          const user = result.user;
          const userData = await mapUserData(user);
          const providerData = user.providerData;
          const value = [...providerData][0];
          console.log(value);
          setTwitterProvider(value);
          localStorage.setItem("twitterProvider", JSON.stringify(value));
          setUserCookie(userData);
          setIsOpen(false);
        })
        .catch((error) => {
          // const errorCode = error.code;
          alert(error.message);
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    } catch (e) {
      console.log(e);
      setIsOpen(false)

    }
  }


  const handleTwitterSignIn = () => {
    openModal();
    setStep(1);
  };


  const handleDemo = () => {
    openModal();
    setStep(2);
  }


  const modalHeader: any = {
    1: "Social Authentication",
    2: "Boost3r Demo",
  };

  const modalContent: any = {
    1: (
      <Center>
        <Button onClick={signInWithTwitter} colorScheme="twitter" mb={2}>
          Sign in with Twitter
        </Button>

      </Center>
    ),
    2: (
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/2Rhz4Bdc8I8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
    ),
  };

  useEffect(() => {

    async function connectToMetamask() {
      const ethereum = (window as any).ethereum;
      if (typeof ethereum !== 'undefined') {
        // Access window.ethereum properties here
        // Connect to MetaMask
        await ethereum.request({ method: 'eth_requestAccounts' });
        const _provider = new ethers.BrowserProvider(ethereum);
        _provider.getSigner()
        setProvider(_provider);

        const network = await _provider.getNetwork();
        const signer = _provider.getSigner();
        const address = await (await signer).getAddress();
        const bal = _provider.getBalance(address);
        setAccount(address);
        const x = ethers.formatUnits(await bal);
        const result = x.slice(0, 6);
        setBalance(result)
        console.log('Connected to MetaMask with address:', address);
        setConnected(true)
        setChain(network.chainId);

      } else {
        // Handle case where MetaMask is not installed
        alert("metamask is not installed in browser")
      }


    }

    if (connect && user) {
      connectToMetamask()
      setConnect(false)
    }
  }, [connect])

  const handleCreate = () => {
    if (creating) {
      setCreating(false)
    } else {
      setCreating(true)
    }

  }




  return (
    <>
      <Sidebar
        variant={variants?.navigation}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
      />

      <Box ml={!variants?.navigationButton ? 200 : 0} zIndex={"tooltip"} position="fixed"
        w={["60%", "25%"]}

      >
        <Header
          showSidebarButton={variants?.navigationButton}
          onShowSidebar={toggleSidebar}
        />
      </Box>

      <PageLayout title='Home' description='Boost3r Platform' >




        <VStack mt="50px" w="100%" minH={"100vh"} ml={!variants?.navigationButton ? 200 : 0} >


          <Box
            position={"fixed"}
            bg="#1d1f37"
            ml={"200px"}
            right={0}

            zIndex={-1}
            h="100vh"
            bottom={-16}
            as="img"
            src="/images/body.png"
            opacity={1}
          />



          <Grid

            templateColumns={["1fr", "1fr", "58% 47%"]}
            gap={4}
            w="100%"
            mx="auto"
            px={5}
            gridColumnGap={"5%"}
          >

            <VStack w="100%" pt={12}>

              {/* Onboarding Banner */}
              <VStack minW="600px"
                bg="#1d1f37"
                borderRadius={24}
                color={"white"}
                h="300px"
                backgroundSize="cover"
                backgroundPosition="center"
                p={8}
                display="flex"
                justifyContent={"space-between"}
                w="100%"
              >

                <Flex direction={"row"}
                  w="100%"
                  justifyContent={"space-between"}
                >

                  <Box w="70%" zIndex={1}>
                    <Flex alignItems={"center"}


                    >
                      <Box>
                        <Box as="img"
                          src='/logos/logoicon.svg'
                          h={8}
                          w="auto"


                        />
                      </Box>
                      <Box>

                        <Center mt="-10px" ml="7px">
                          <Text fontSize={"sm"}> Ultimate web3 marketing experience!</Text>
                        </Center>

                      </Box>
                    </Flex>


                    <Text
                      py={5}
                      fontSize={"xl"}
                      fontWeight={700}
                    >
                      A Campaign is Only as Good as the Exposure it Gets!
                    </Text>

                    <Text
                      fontSize={"sm"}
                      color={"whiteAlpha.700"}
                    >
                      Boost3r empowers web3 businesses to easily create and manage campaigns for new products & events. </Text>



                    <HStack py={5}>

                      {
                        !userObject && (
                          <Button rightIcon={
                            <FiPlay />

                          }
                            borderRadius={12}
                            h="48px"
                            onClick={handleDemo}
                          >
                            WATCH DEMO
                          </Button>
                        )
                      }

                      <Button
                        borderRadius={12}
                        h="48px"
                        bg="#4652f9"
                        _hover={{
                          bg: "#1a25c5"
                        }}
                        _active={{
                          bg: "#1a25c5"
                        }}
                        onClick={
                          userObject && !connected ? () => setConnect(true) : userObject && connected ? handleCreate :
                            handleTwitterSignIn}
                      >
                        {!userObject ? "GET STARTED" : userObject && !connected ? "CONNECT WALLET" : "CREATE CAMPAIGN"}
                      </Button>

                    </HStack>



                  </Box>

                  <VStack w="30%">
                    <Box position={"absolute"} w="600px" h="250px" left={"260px"}
                      marginTop="20px"
                      sx={{
                        backgroundImage: "url('/images/grad.svg')",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center"
                      }}
                    />

                  </VStack>



                </Flex>

                <Box>
                  <Box position={"absolute"} as="img"
                    h="200px"
                    top={"200px"}
                    marginLeft="130px"
                    float="right"
                    src='/images/rocket.png'
                  />
                </Box>

              </VStack>


              {/* Campaigns */}
              <Slider />
            </VStack>

            <VStack w="30%" px={5} position="fixed"
              marginTop={"30px"}

              right={"20px"}
            >

              <Box
                borderRadius={24}
                h="fit-content"
                w="100%"
                bg={"#1d1f37"}
                pt={2}

              >

                <Box
                  position={"absolute"}
                  marginTop={"120px"}
                  ml={2}
                  right="40px"
                  h="140px"
                  as="img"
                  src="/images/mantle.png"
                  opacity={0.05}
                />


                <WalletCard />
                <ProfileCard />
              </Box>


            </VStack>
          </Grid>



        </VStack>


      </PageLayout>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bg={"#1d1f37"}>


          <ModalHeader>{modalHeader[step]}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalContent[step]}</ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <CreateCampaignModal isOpen={creating} onClose={handleCreate} />



    </>
  );
}
