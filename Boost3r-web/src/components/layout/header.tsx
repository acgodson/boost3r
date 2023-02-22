import { HStack, Button, Box, Text } from '@chakra-ui/react';
import { GlobalContext } from 'contexts/global';
import { useContext } from 'react';
import { FaGlobe } from 'react-icons/fa';


const Header = () => {
  const { chain }: any = useContext(GlobalContext);

  return (
    <>




      <HStack
        as='header'
        position='fixed'
        top='0'
        p={3}
        zIndex='tooltip'
        justify='end'
        align='center'
        w='100%'
        pr={12}
      >
        <Box position="absolute"
          p={3}
          top='0'
          zIndex='tooltip'
          color="white"
          w='100%'
          pl={"280px"}

          display={["none", "none", "flex"]}

        >
          <Box position={"relative"} as="img"
            h="auto"
            w="15%"
            src='/images/camp.png'
            py={2}
          />

        </Box>

        <Button disabled={true}

          _hover={{
            backgroundColor: {}
          }}
          leftIcon={chain ? <FaGlobe /> : <Box />}
        >

          {!chain ? "NO NETWORK" : chain !== 5001n ? "UNSUPPORTED" : "MANTLE"}

        </Button>
      </HStack>
    </>

  );
};

export default Header;
