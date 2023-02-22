import { Box, IconButton, Flex } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

interface Props {
    onShowSidebar: () => void
    showSidebarButton?: boolean
}

const Header = ({ showSidebarButton = true, onShowSidebar }: Props) => {
    return (
        <Flex bg="transparent" p={4} color="white" justifyContent="flex-start" w="100%"
            alignItems={"center"}>
            <Box flex="1" >
                {showSidebarButton && (
                    <IconButton
                        icon={<ChevronRightIcon w={8} h={8} />}
                        color="whiteAlpha.800"
                        variant="outline"
                        onClick={onShowSidebar} aria-label={''} />
                )}
            </Box>

            <Box as="img" src="/logos/logo-text.png"
                h={["28px", "31px"]}
                ml={[3, 0]}
                w="auto"
                display={["inherit", "none"]}
                alignSelf={"center"}
            />

            <Box flex="1" />
        </Flex>
    )
}

export default Header
