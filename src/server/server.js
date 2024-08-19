const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

// Initialize Express and http server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize SQLite database
const db = new sqlite3.Database("./chatapp.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");

    // Create messages table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic TEXT,
      sender TEXT,
      text TEXT,
      timestamp TEXT
    )`);
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Retrieve previous messages when a user joins a topic
  socket.on("joinTopic", (topic) => {
    db.all(
      `SELECT * FROM messages WHERE topic = ? ORDER BY timestamp`,
      [topic],
      (err, rows) => {
        if (err) {
          console.error("Error retrieving messages:", err.message);
          return;
        }
        socket.emit("previousMessages", { topic, messages: rows });
      }
    );
  });

  // Listen for new chat messages
  socket.on("sendMessage", (message) => {
    const { topic, sender, text, timestamp } = message;
    db.run(
      `INSERT INTO messages (topic, sender, text, timestamp) VALUES (?, ?, ?, ?)`,
      [topic, sender, text, timestamp],
      function (err) {
        if (err) {
          console.error("Error saving message:", err.message);
        } else {
          // Include the message ID in the response
          message.id = this.lastID;
          // Broadcast the message to all clients
          io.emit("receiveMessage", message);
        }
      }
    );
  });

  // Handle message deletion
  socket.on("deleteMessage", (id) => {
    db.run(`DELETE FROM messages WHERE id = ?`, id, (err) => {
      if (err) {
        console.error("Error deleting message:", err.message);
      } else {
        // Broadcast the deletion to all clients
        io.emit("messageDeleted", id);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
server.listen(4010, () => {
  console.log("Server is running on port 4010");
});
