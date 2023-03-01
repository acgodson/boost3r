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
    Text,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Center
} from '@chakra-ui/react'
import { FiBookOpen, FiHome, FiSettings } from 'react-icons/fi'
import { FaTwitter } from "react-icons/fa";
import { GlobalContext } from 'contexts/global';
import { useContext, useState } from 'react';




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

const SidebarContent = (prop: { username: string, avatar: string, openSettings: () => void }) => (

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
                Navitems.map((x, i) => (
                    <Button key={x.name} w="100%" bg="#3b3170" borderRadius={18} h={"48px"}

                        onClick={i == 2 ? (prop.openSettings)
                            : () => { }
                        }

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

    const { twitterProvider, user, logout }: any = useContext(GlobalContext);
    const [openSettings, setOpenSettings] = useState(false)

    const userObject = !twitterProvider ? null : twitterProvider;
    const twitterUsername = !userObject ? "yourHandle" : userObject.displayName;
    const profileAvatar = !userObject ? "https://i.pravatar.cc/150?img=1" : userObject.photoURL;

    function handleClose() {
        if (openSettings) {
            setOpenSettings(false)
        } else {
            setOpenSettings(true)
        }

    }

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


                <SidebarContent username={twitterUsername} avatar={profileAvatar} openSettings={() => setOpenSettings(true)} />

            </Box>

            <Modal isOpen={openSettings} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent bg={"#1d1f37"}>
                    <ModalHeader>Settings</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        {
                            user &&

                            <Center>
                                <Button onClick={user ? logout : null} colorScheme="twitter" mb={2}>
                                    Logout
                                </Button>

                            </Center>
                        }


                        {!user && (
                            <Center>
                                <Button onClick={user ? logout : null} colorScheme="twitter" mb={2}>
                                    Please click on get started to login
                                </Button>

                            </Center>
                        )}




                    </ModalBody>

                </ModalContent>
            </Modal>

        </Box >
    ) : (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay>
                <DrawerContent bg={"#141627"}>

                    <DrawerHeader />
                    <DrawerBody py={16}>
                        <SidebarContent username={twitterUsername} avatar={profileAvatar} openSettings={() => setOpenSettings(true)} />
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    )
}

export default Sidebar
