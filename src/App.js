import React, { useState } from "react";
import { Stack, Nav } from "@fluentui/react";
import ChatInterface from "./ChatInterface";

const App = () => {
  const [selectedKey, setSelectedKey] = useState("chat");

  const topics = {
    topic1: "React",
    topic2: "JavaScript",
    topic3: "WebSockets",
    topic4: "Fluent UI",
  };

  const navLinkGroups = [
    {
      links: [
        {
          name: "Chat",
          key: "chat",
          icon: "Chat",
          onClick: () => setSelectedKey("chat"),
        },
        {
          name: "Topics",
          key: "topics",
          icon: "BulletedList",
          links: Object.keys(topics).map((key) => ({
            name: topics[key],
            key: key,
            onClick: () => setSelectedKey(key),
          })),
          isExpanded: true, // Start with the accordion expanded
        },
      ],
    },
  ];

  return (
    <Stack horizontal styles={{ root: { height: "100vh" } }}>
      {/* Left Navigation Menu */}
      <Nav
        groups={navLinkGroups}
        selectedKey={selectedKey}
        styles={{
          root: {
            width: 250,
            boxSizing: "border-box",
            borderRight: "1px solid #ddd",
          },
        }}
      />

      {/* Main Content Area */}
      <Stack grow styles={{ root: { padding: 20 } }}>
        {selectedKey === "chat" && <ChatInterface />}
        {selectedKey.startsWith("topic") && (
          <div>
            <h2>{topics[selectedKey]}</h2>
            <ChatInterface topic={topics[selectedKey]} />
          </div>
        )}
      </Stack>
    </Stack>
  );
};

export default App;
