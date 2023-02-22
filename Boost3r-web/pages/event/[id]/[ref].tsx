import { useRouter } from 'next/router';
import { Box, Grid, Text, VStack } from '@chakra-ui/react';
import PageLayout from 'src/components/page-layout';
import ProfileCard from 'src/components/profile';
import WalletCard from 'src/components/wallet';
import EventCard from 'src/components/event';

function EventPage() {
    const router = useRouter();
    const { id, ref }: any = router.query;

    const refID: number = parseInt(ref);

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
                            <EventCard id={id!} refId={refID} />




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
