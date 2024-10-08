![image](https://github.com/user-attachments/assets/7923a823-1f9f-42c2-b050-8fc6496cea38)

## Sample Chat Application.
This is a protoype application and is not intended for production use.  
It lacks many of the necessary functions of a chat application, such as separate user identity support.

## Chat Application Installation Instructions
This guide will help you set up and run the chat application on your local machine.

# Prerequisites

Before you begin, ensure you have the following installed:

Node.js (version 12 or later)
npm (comes with Node.js)
SQLite3 

# Step 1: Clone the Repository
If you have Git installed, clone the repository to your local machine:
git clone https://github.com/CD1010/fluent-ui-chat.git

## Step 2: Install Server Dependencies
Navigate to the server directory and install the necessary dependencies:

# Server

cd server

npm install 

# Step 3: Set Up the SQLite Database
The SQLite database will be automatically set up when the server runs. The database file (chatapp.db) will be created in the server directory.

# Step 4: Start the Server
Start the Node.js server:

# run: 
node server.js

The server will start on port 4010. You should see the following output:

Server is running on port 4010

# Step 5: Install Client Dependencies
Open a new terminal window, navigate to the root directory of the project, and install the client dependencies:

cd to the fluent-ui-chat folder 

# run:
npm install

# Step 6: Start the React Client
Start the React application:

#run:
npm start

This will automatically open a new browser window at http://localhost:3000 with the chat application.

# Step 7: Test the Application
Open Multiple Browser Tabs: Open another tab in your browser to simulate different users.
Send Messages: Type and send messages in different tabs to see them appear in real-time in all browsers.
Delete Messages: Click the delete button next to any message to remove it from the chat.
Optional: Interact with the SQLite Database
You can interact with the SQLite database directly using tools like the SQLite3 command-line interface or any SQLite GUI tool to view or manage the data.

# Troubleshooting
Port Conflicts: If port 4010 or 3000 is in use, you may need to stop other services or change the port in the server or React configuration.
Database Issues: If you encounter issues with the database, ensure that SQLite is correctly installed and accessible on your system.
# Conclusion
You now have the chat application running locally with real-time messaging and the ability to delete messages. This setup uses SQLite for persistent storage and is suitable for local development and testing.
