import React from "react";
import { Stack } from "@fluentui/react";
import ChatInterface from "./ChatInterface";

function App() {
  return (
    <Stack
      styles={{ root: { height: "100vh", width: "100vw" } }}
      verticalAlign="center"
      horizontalAlign="center"
    >
      <ChatInterface />
    </Stack>
  );
}

export default App;
