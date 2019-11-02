import React from "react";
import useSWR from "swr";

const apiUrl = "https://mte4gv5azj.execute-api.us-east-1.amazonaws.com/prod/";

const App: React.FC = () => {
  const { data: projects } = useSWR("/api/projects");
  const { data: metrics, error } = useSWR(
    () => `/api/metrics/?id=${projects[0].id}`
  );

  if (!projects) {
    return <div>Loading...</div>;
  }

  return <div className="App"></div>;
};

export default App;
