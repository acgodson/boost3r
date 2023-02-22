import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import Footer from './footer';
import GHeader from './header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <GHeader />

      <Box as='main'>{children}</Box>
      <Footer />
    </>
  );
};

export default Layout;
