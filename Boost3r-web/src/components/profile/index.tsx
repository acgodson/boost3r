import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { GlobalContext } from "contexts/global";
import { useContext } from "react";

// const Imag = (
//     <svg width="200" height="200" viewBox="0 0 200 200" id="badge">
//         <circle cx="100" cy="100" r="70" fill="#FFC107" stroke="#FDD835" stroke-width="10" />
//         <path id="curve" d="M 60 140 Q 100 170 140 140" stroke="none" fill="#FDD835" />
//         <text font-size="28" font-weight="bold" fill="#fff">
//             <textPath xlinkHref="#curve">
//                 Mantle
//             </textPath>
//         </text>

//         <text x="50%" y="47%" text-anchor="middle" font-size="13" font-weight="bold" fill="#fff">PARTICPANT</text>
//     </svg>
// );


function ProfileCard() {

    const { account }: any = useContext(GlobalContext);

    const poapAvatars = [
        "https://i.pravatar.cc/50?img=2",
        "https://i.pravatar.cc/50?img=3",
        "https://i.pravatar.cc/50?img=4"
    ];


    return (
        <Flex
            boxShadow="lg"
            p={4}
            borderRadius="md"
            align="flex-start"
            justify="space-between"
            flexDirection="column"

        ><VStack w="100%" px={3} py={1} textAlign="left" justifyContent={"flex-start"} display="flex" >

                <Text fontSize="sm" fontWeight="bold" mr={2} textAlign="left" color="blue.500">
                    POAP NFTs
                </Text>
                <Flex justifyContent="flex-start" mb={4} w="100%">


                    <Box display="flex">
                        {poapAvatars.map((avatarUrl) => (
                            <Box px={1} key={avatarUrl} >
                                {
                                    account ?

                                        <Box h="80px" w="80px" rounded={"full"}
                                            bg="#141627"
                                        />


                                        // <Avatar size="md"
                                        //     src={avatarUrl} /> 


                                        :
                                        <Box h="80px" w="80px" rounded={"full"}
                                            bg="#141627"
                                        />
                                }
                            </Box>

                        ))}

                    </Box>
                    <ChevronRightIcon fontSize="50px" color={"whiteAlpha.300"} />
                </Flex>
            </VStack>


        </Flex>
    );
}

export default ProfileCard;
