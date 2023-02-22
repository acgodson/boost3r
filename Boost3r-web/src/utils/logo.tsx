import { Box } from "@chakra-ui/react";

interface LogoPropsType {
  width?: string;
  height?: string;
}

export function Logo(props: LogoPropsType) {
  const width = props.width || '151';
  const height = props.height || '44';

  return (
    <Box as="img" src="/logos/logoicon.svg"
      width={width}
      height={height}
    />
  );
}
