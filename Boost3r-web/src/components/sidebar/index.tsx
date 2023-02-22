import {
    Box,
    Button,
    Drawer,
    DrawerOverlay,
    DrawerHeader,
    DrawerBody,
    DrawerContent,
    VStack,
    Avatar,
    IconButton,
    Flex,
    Text
} from '@chakra-ui/react'
import { FiBookOpen, FiHome, FiSettings } from 'react-icons/fi'
import { FaTwitter } from "react-icons/fa";
import { GlobalContext } from 'contexts/global';
import { useContext } from 'react';




interface Props {
    onClose: () => void
    isOpen: boolean
    variant: 'drawer' | 'sidebar'
}


const Navitems = [
    {
        name: "Dashboard",
        url: "",
        icon: <FiHome />

    },
    {
        name: "Reports",
        url: "",
        icon: <FiBookOpen />

    },
    {
        name: "Settings",
        url: "",
        icon: <FiSettings />

    },

]

const SidebarContent = (prop: { username: string, avatar: string }) => (

    <VStack py={12} >
        <>

            <Avatar
                mb={6}
                rounded={"full"}
                h="100px"
                w="100px"
                bg={"#1d1f37"}
                src={prop.avatar}
            />


            <Flex pb={3}>
                <Text mr={2} color="whiteAlpha.700">@{prop.username}</Text>
                <IconButton
                    mt={0.5}
                    aria-label="View on Twitter"
                    icon={<FaTwitter />}
                    colorScheme="twitter"
                    h='20px'
                />
            </Flex>
            {
                Navitems.map((x) => (
                    <Button key={x.name} w="100%" bg="#3b3170" borderRadius={18} h={"48px"}

                        leftIcon={x.icon}
                        justifyContent="flex-start"
                    >
                        {x.name}
                    </Button>
                ))
            }

        </>
    </VStack>
)

const Sidebar = ({ isOpen, variant, onClose }: Props) => {

    const { twitterProvider }: any = useContext(GlobalContext);

    const userObject = !twitterProvider ? null : twitterProvider;
    const twitterUsername = !userObject ? "yourHandle" : userObject.displayName;
    const profileAvatar = !userObject ? "https://i.pravatar.cc/150?img=1" : userObject.photoURL;
    return variant === 'sidebar' ? (
        <Box
            position="fixed"
            w="220px"
            h="100%"
            bg="#141627"
            display={"flex"}
            flexDirection="column"
            justifyContent="flex-start"
        >
            <Box w="100%" h="70%"
                p={5}
            >
                <Box as="img" src="/logos/logo-text.png"
                    h={"28px"}

                    w="auto"
                    alignSelf={"center"}
                />

                <Box position={"absolute"} w="100%" h="80%" right={0}
                    sx={{
                        backgroundImage: "url('/images/grad.svg')",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "left"
                    }}
                />


                <SidebarContent username={twitterUsername} avatar={profileAvatar} />

            </Box>

        </Box >
    ) : (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay>
                <DrawerContent>

                    <DrawerHeader />
                    <DrawerBody py={16}>
                        <SidebarContent username={twitterUsername} avatar={profileAvatar} />
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    )
}

export default Sidebar
