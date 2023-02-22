import { ColorModeScript } from '@chakra-ui/react';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class Doc extends Document {
  override render() {
    return (
      <Html lang='en'>
        <Head />
        <body>
          <ColorModeScript initialColorMode={"dark"} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Doc;
