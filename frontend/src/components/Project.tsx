import React from 'react';
import Project from '../../../bin/types/Project';
import { Box, Text, Flex } from 'rebass';

interface ProjectProps {
  project: Project;
  onClick: (e: any) => void;
}

const ProjectComponent: React.FC<ProjectProps> = (props: ProjectProps) => {
  return (
    <Flex
      onClick={props.onClick}
      width={'100%'}
      sx={{
        borderBottom: 'solid 1px #BBB',
        padding: 10,
        cursor: 'pointer',
      }}
      flexDirection="column"
    >
      <Text fontSize={[3]} fontWeight="bold">
        {props.project.name || '<Name missing>'}
      </Text>
      <Text fontWeight="bold" color="#999" fontSize={[1]}>
        {props.project.method.toUpperCase()} {props.project.endpoint}
      </Text>
    </Flex>
  );
};

export default ProjectComponent;
