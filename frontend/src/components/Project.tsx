import React from 'react';
import Project from '../../../bin/types/Project';
import { Text, Flex } from 'rebass';

interface ProjectProps {
  project: Project;
  onClick: (e: any) => void;
}

const ProjectComponent: React.FC<ProjectProps> = (props: ProjectProps) => {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        borderBottom: 'solid 1px #BBB',
        padding: 10,
        cursor: 'pointer',
      }}
    >
      <Flex onClick={props.onClick} flexDirection="column">
        <Text fontSize={[3]} fontWeight="bold">
          {props.project.name || '<Name missing>'}
        </Text>
        <Text fontWeight="bold" color="#999" fontSize={[1]}>
          {props.project.method.toUpperCase()} {props.project.endpoint}
        </Text>
      </Flex>
      <Flex flexDirection="column" alignItems="right">
        <Text fontSize={[2]} fontWeight="bold" textAlign="right">
          Uptime: 95.64%
        </Text>
        <Text fontSize={[2]} fontWeight="bold" textAlign="right">
          Mean response time: 852ms
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProjectComponent;
