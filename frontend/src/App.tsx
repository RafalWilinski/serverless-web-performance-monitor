import React, { useState } from "react";
import useSWR from "swr";
import { BarLoader } from "react-spinners";
import ProjectComponent from "./components/Project";
import Project from "../../bin/types/Project";
import ProjectDetails from "./components/ProjectDetails";
import Footer from "./components/Footer";

const apiUrl = "https://vyp8gdgq4c.execute-api.us-east-1.amazonaws.com/prod";

const _fetch = (query: string) =>
  fetch(`${apiUrl}${query}`).then(res => res.json());

const App: React.FC = () => {
  const [currentProjectId, setCurrentProjectId] = useState("0");
  const { data } = useSWR("/projects", _fetch);
  const { data: metricsData, error } = useSWR(
    () => `/metrics?id=${currentProjectId}`,
    _fetch
  );

  if (!data) {
    return (
      <div style={{ margin: 20 }}>
        <BarLoader color="#4A90E2" />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1360,
        margin: "auto"
      }}
    >
      {data.projects.map((project: Project) => (
        <>
          <ProjectComponent
            key={project.id}
            project={project}
            onClick={() =>
              setCurrentProjectId(
                currentProjectId === project.id ? "-1" : project.id
              )
            }
          />
          {project.id === currentProjectId && (
            <ProjectDetails metricsData={metricsData} />
          )}
        </>
      ))}
    </div>
  );
};

export default App;
