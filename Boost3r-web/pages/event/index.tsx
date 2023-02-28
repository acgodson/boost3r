import { useRouter } from 'next/router';
import { Box, Grid, Text, VStack } from '@chakra-ui/react';
import PageLayout from 'src/components/page-layout';
import ProfileCard from 'src/components/profile';
import WalletCard from 'src/components/wallet';
import EventCard from 'src/components/event';
import { GlobalContext } from 'contexts/global';
import { ethers } from 'ethers';
import { useContext, useEffect } from 'react';

function EventPage() {
    const router = useRouter();
    const { id, ref }: any = router.query;
    const {
        setChain,
        setAccount,
        setProvider,
        setConnected,
        account
    }: any = useContext(GlobalContext);
    const refID: number = parseInt(ref);




    useEffect(() => {

        //Check if metamask is connected already
        const ethereum = (window as any).ethereum;
        const _provider = new ethers.BrowserProvider(ethereum);
        setProvider(_provider);
        function handleAccountsChanged(accounts: string | any[]) {
            let currentAccount;

            async function switchNetwork() {
                // Switch to the specified network
                try {
                    await ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{
                            chainId: "0x1389",
                            // rpcUrls: ["https://rpc.testnet.mantle.xyz"],
                        }],
                        nativeCurrency: {
                            name: "BIT",
                            symbol: "BIT",
                            decimals: 18
                        },
                        blockExplorerUrls: ["https://explorer.testnet.mantle.xyz"]
                    });
                    router.reload();

                } catch (error) {
                    console.error(error);
                    // If the user doesn't switch networks, you can show an error message here
                    return;
                }
            }
            async function getNet(prov: any) {
                const network = await prov.getNetwork();

                if (network) {
                    console.log(network)
                    setChain(network.chainId);
                    if (network.chainId !== 5001n) {
                        switchNetwork();
                    }
                    // if (account) {
                    //   const bal = await prov.getBalance(account);
                    //   if (bal) {
                    //     const x = ethers.formatUnits(bal);
                    //     const result = x.slice(0, 6);
                    //     setBalance(result)
                    //   }
                    // }

                }
            }

            if (accounts.length === 0) {
                console.log("no account connected");
                setConnected(false)
            } else if (accounts[0] !== currentAccount) {
                currentAccount = accounts[0];
                setAccount(currentAccount);
                setConnected(true);
                getNet(_provider);
            }
        }
        function checkConnection() {
            ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChanged).catch(console.error);
        }

        async function isMetamaskConnected() {
            if (typeof ethereum !== "undefined") { // Check if MetaMask is installed
                checkConnection();
            } else {
                return false;
            }
        }
        if (id && ref) {
            isMetamaskConnected();
        }
    }, []);









    return (
        <>
            <Box p={4} position="fixed">

                <Text>
                    ID: {id}, Referrer: {refID}
                </Text>
            </Box>



            <PageLayout title='Campaign' description='Event Name' >
                <VStack mt="50px" w="100%" minH={"100vh"} >
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



                            {/* Campaign */}
                            {

                                account &&

                                <EventCard id={id!} refId={refID} />

                            }


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





        </>
    );
}

export default EventPage;
