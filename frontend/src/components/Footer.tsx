import React from 'react';
import { Flex } from 'rebass';

interface FooterProps {}

const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  return (
    <Flex
      sx={{
        position: 'absolute',
        bottom: 0,
      }}
    >
      <a href="https://rwilinski.me" target="_blank" rel="noopener noreferrer">
        Made by Rafal Wilinski
      </a>
      <a href="https://servicefull.cloud" target="_blank" rel="noopener noreferrer">
        Servicefull
      </a>
    </Flex>
  );
};

export default Footer;
