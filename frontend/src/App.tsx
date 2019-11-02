import React from "react";
import useSWR from "swr";

const App: React.FC = () => {
  const { data: projects } = useSWR("/api/projects");
  const { data: metrics, error } = useSWR(
    () => `/api/metrics/${projects[0].id}`
  );

  if (!projects) {
    return <div>Loading...</div>;
  }

  return <div className="App"></div>;
};

export default App;
