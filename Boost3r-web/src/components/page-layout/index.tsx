import { Container, ContainerProps } from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';
import { NextSeo } from 'next-seo';
import type { ReactNode } from 'react';

const variants: Variants = {
  hidden: {
    opacity: 0,
    x: 0,
    y: -40,
    transition: { duration: 0.4, type: 'easeOut' },
  },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.4, type: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: -0,
    y: 40,
    transition: { duration: 0.4, type: 'easeOut' },
  },
};

type PageProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const MotionContainer = motion<ContainerProps>(Container);

const PageLayout = ({ title, description, children }: PageProps) => {
  return (
    <>
      <NextSeo
        title={title + ' |  Boost3r'}
        description={description}
        twitter={{
          cardType: 'summary_large_image',
          handle: '@Ac_godson',
        }}
        openGraph={{
          url: 'https://boost3r.vercel.app/',
          title: title,
          description: description,
          locale: 'en_US',
          images: [
            {
              url: 'https://boost3r.vercel.app/logo.png',
              width: 1200,
              height: 630,
              alt: 'Boost3r',
              type: 'image/png',
            },
          ],
        }}
      />
      <MotionContainer
        display='flex'
        maxW='container.lg'
        minH={{ base: 'auto', md: '100vh' }}
        px={{ base: 4, lg: 8 }}
        initial='hidden'
        animate='enter'
        exit='exit'
        variants={variants}
        centerContent
      >
        {children}
      </MotionContainer>
    </>
  );
};

export default PageLayout;