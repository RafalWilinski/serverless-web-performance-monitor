import React, { useState } from 'react';
import useSWR from 'swr';
import { Flex } from 'rebass';
import { BarLoader } from 'react-spinners';
import ProjectComponent from './components/Project';
import Project from '../../bin/types/Project';
import ProjectDetails from './components/ProjectDetails';
import Footer from './components/Footer';

const apiUrl = 'https://vyp8gdgq4c.execute-api.us-east-1.amazonaws.com/prod';

const _fetch = (query: string) => fetch(`${apiUrl}${query}`).then((res) => res.json());

const App: React.FC = () => {
  const [currentProjectId, setCurrentProjectId] = useState('0');
  const { data } = useSWR('/projects', _fetch);
  const { data: metricsData, error } = useSWR(() => `/metrics?id=${currentProjectId}`, _fetch);

  console.log(!data || !metricsData);

  if (!data) {
    return (
      <div style={{ margin: 20 }}>
        <BarLoader color="#4A90E2" />
      </div>
    );
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
      <Footer />
    </div>
  );
};

export default App;
