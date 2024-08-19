import React, { useState } from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  GroupedList,
  Stack,
  Text,
} from "@fluentui/react";

const topicsData = [
  {
    key: "group1",
    name: "React",
    topics: [
      { key: "1", name: "Hooks" },
      { key: "2", name: "State Management" },
      { key: "3", name: "Context API" },
    ],
  },
  {
    key: "group2",
    name: "JavaScript",
    topics: [
      { key: "1", name: "ES6+" },
      { key: "2", name: "Promises" },
      { key: "3", name: "Async/Await" },
    ],
  },
  {
    key: "group3",
    name: "WebSockets",
    topics: [
      { key: "1", name: "Socket.IO" },
      { key: "2", name: "WebSocket Protocol" },
    ],
  },
  {
    key: "group4",
    name: "Fluent UI",
    topics: [
      { key: "1", name: "Components" },
      { key: "2", name: "Styling" },
    ],
  },
];

const Topics = () => {
  const [groups, setGroups] = useState(
    topicsData.map((group, index) => ({
      key: group.key,
      name: group.name,
      startIndex: index * group.topics.length,
      count: group.topics.length,
      isCollapsed: true,
    }))
  );

  const columns = [
    {
      key: "column1",
      name: "Topic",
      fieldName: "name",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
  ];

  const items = topicsData.flatMap((group) => group.topics);

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Text variant="xLarge">Topics</Text>
      <GroupedList
        items={items}
        onRenderCell={(nestingDepth, item) => (
          <DetailsList
            items={[item]}
            columns={columns}
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={false}
          />
        )}
        groups={groups}
        onRenderHeader={(groupProps) => {
          const onToggleCollapse = () => {
            const newGroups = [...groups];
            const groupIndex = newGroups.findIndex(
              (g) => g.key === groupProps.group.key
            );
            newGroups[groupIndex].isCollapsed =
              !newGroups[groupIndex].isCollapsed;
            setGroups(newGroups);
          };

          return (
            <div
              onClick={onToggleCollapse}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor: "#f3f2f1",
                borderBottom: "1px solid #ddd",
              }}
            >
              <Text variant="large">{groupProps.group.name}</Text>
            </div>
          );
        }}
      />
    </Stack>
  );
};

export default Topics;
