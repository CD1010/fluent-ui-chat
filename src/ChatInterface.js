import React, { useState, useEffect } from "react";
import {
  TextField,
  PrimaryButton,
  Stack,
  Persona,
  PersonaSize,
  initializeIcons,
} from "@fluentui/react";
import io from "socket.io-client";

// Initialize Fluent UI icons
initializeIcons();

const socket = io("http://localhost:4010", {
  transports: ["websocket", "polling"], // Ensure compatibility with various transports
  reconnectionAttempts: 5, // Limit reconnection attempts
});

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Listen for incoming messages from the WebSocket server
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const messageObj = {
        id: messages.length + 1,
        text: newMessage,
        sender: "You",
        avatarUrl: "https://example.com/your-avatar.png", // Replace with actual avatar URL
      };

      // Send the message to the WebSocket server
      socket.emit("sendMessage", messageObj);

      // Clear the input field after sending the message
      setNewMessage("");
    }
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
      <h2>Chat</h2>
      <Stack
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 10,
          backgroundColor: "#f3f2f1",
          borderRadius: 4,
        }}
      >
        {messages.map((message) => (
          <Stack
            horizontal
            tokens={{ childrenGap: 10 }}
            key={message.id}
            style={{ marginBottom: 10 }}
          >
            <Persona
              imageUrl={message.avatarUrl}
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
