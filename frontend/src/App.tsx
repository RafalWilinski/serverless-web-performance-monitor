import React, { useState } from 'react';
import useSWR from 'swr';
import { Flex } from 'rebass';
import ProjectComponent from './Project';
import Project from '../../bin/types/Project';
import ProjectDetails from './ProjectDetails';

const apiUrl = 'https://mte4gv5azj.execute-api.us-east-1.amazonaws.com/prod';

const _fetch = (query: string) => fetch(`${apiUrl}${query}`).then((res) => res.json());

const App: React.FC = () => {
  const [currentProjectId, setCurrentProjectId] = useState('0');
  const { data } = useSWR('/projects', _fetch);
  const { data: metricsData, error } = useSWR(() => `/metrics?id=${currentProjectId}`, _fetch);

  console.log(!data || !metricsData);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        {data.projects.map((project: Project) => (
          <>
            <ProjectComponent
              key={project.id}
              project={project}
              onClick={() => setCurrentProjectId(project.id)}
            />
            {project.id === currentProjectId && <ProjectDetails metricsData={metricsData} />}
          </>
        ))}
      </Flex>
    </div>
  );
};

export default App;
