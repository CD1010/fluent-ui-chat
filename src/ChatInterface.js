import React, { useState, useEffect } from "react";
import {
  TextField,
  PrimaryButton,
  Stack,
  Persona,
  PersonaSize,
  IconButton,
  initializeIcons,
} from "@fluentui/react";
import io from "socket.io-client";

// Initialize Fluent UI icons
initializeIcons();

const socket = io("http://localhost:4010", {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
});

const ChatInterface = ({ topic = "General" }) => {
  const [allMessages, setAllMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Join the selected topic
    socket.emit("joinTopic", topic);

    // Handle incoming previous messages for the selected topic
    socket.on("previousMessages", ({ topic, messages }) => {
      setAllMessages((prevMessages) => ({
        ...prevMessages,
        [topic]: messages,
      }));
    });

    // Handle incoming new messages
    socket.on("receiveMessage", (message) => {
      setAllMessages((prevMessages) => ({
        ...prevMessages,
        [message.topic]: [...(prevMessages[message.topic] || []), message],
      }));
    });

    // Handle message deletion
    socket.on("messageDeleted", (id) => {
      setAllMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        updatedMessages[topic] = updatedMessages[topic].filter(
          (msg) => msg.id !== id
        );
        return updatedMessages;
      });
    });

    // Cleanup on component unmount
    return () => {
      socket.off("previousMessages");
      socket.off("receiveMessage");
      socket.off("messageDeleted");
    };
  }, [topic]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const messageObj = {
        sender: "You",
        text: newMessage,
        topic: topic,
        timestamp: new Date().toISOString(),
      };

      // Send the message to the server
      socket.emit("sendMessage", messageObj);

      // Clear the input field after sending the message
      setNewMessage("");
    }
  };

  const handleDeleteMessage = (id) => {
    // Send delete request to the server
    socket.emit("deleteMessage", id);
  };

  return (
    <Stack
      tokens={{ childrenGap: 15, padding: 15 }}
      styles={{
        root: {
          height: "100%",
          width: "100%",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: 8,
        },
      }}
    >
      <h3>Conversation for {topic}</h3>
      <Stack
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 10,
          backgroundColor: "#f3f2f1",
          borderRadius: 4,
        }}
      >
        {(allMessages[topic] || []).map((message, index) => (
          <Stack
            horizontal
            tokens={{ childrenGap: 10 }}
            key={index}
            style={{ marginBottom: 10 }}
          >
            <IconButton
              iconProps={{ iconName: "Delete" }}
              title="Delete"
              ariaLabel="Delete"
              onClick={() => handleDeleteMessage(message.id)}
            />
            <Persona
              imageUrl={
                message.avatarUrl || "https://example.com/your-avatar.png"
              }
              text={message.sender}
              size={PersonaSize.size32}
              hidePersonaDetails={true}
            />
            <Stack>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: 10,
                  borderRadius: 8,
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  maxWidth: "100%",
                  wordWrap: "break-word",
                }}
              >
                {message.text}
              </div>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <TextField
          value={newMessage}
          onChange={(e, newValue) => setNewMessage(newValue || "")}
          placeholder="Type a message..."
          styles={{ root: { flexGrow: 1 } }}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <PrimaryButton text="Send" onClick={handleSendMessage} />
      </Stack>
    </Stack>
  );
};

export default ChatInterface;
