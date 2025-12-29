# ModernLiveChat - Backend

The server-side application for ModernLiveChat, a real-time messaging and social platform. Built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication**: Secure JWT-based authentication (Login/Register).
- **Real-time Communication**: Socket.io integration for instant messaging and typing indicators.
- **Chat Management**:
    - One-on-one private chats.
    - Group chats (Create, Rename, Add/Remove users).
- **Message Handling**: Send and receive text messages in real-time.
- **Social Feed**:
    - Create posts with text and images.
    - Like and Comment on posts.
    - View global social feed.
- **Image Upload**: Server-side image upload handling using Multer and Cloudinary.
- **User Profile**: Update profile details and profile picture.
- **Error Handling**: Centralized error handling middleware.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose ODM)
- **Real-time Engine**: [Socket.io](https://socket.io/)
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt.js
- **File Upload**: Multer & Multer-Storage-Cloudinary

## 📂 Project Structure

```
server/
├── config/             # Database and Cloudinary configuration
├── controllers/        # Request logic (Auth, Chat, Message, Post)
├── middleware/         # Auth protection & Error handling
├── models/             # Mongoose schemas (User, Chat, Message, Post)
├── routes/             # API interactions
├── socket/             # Socket.io connection logic
└── server.js           # Entry point
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BACKEND_URL=http://localhost:5000
```

## 🏁 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Dev Server** (with Nodemon):
    ```bash
    npm run dev
    ```

3.  **Start Production Server**:
    ```bash
    npm start
    ```

## 🔗 API Endpoints

### Auth
- `POST /api/auth` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth?search=query` - Search users
- `PUT /api/auth/profile` - Update user profile

### Chat
- `POST /api/chat` - Access or create one-on-one chat
- `GET /api/chat` - Fetch all chats for user
- `POST /api/chat/group` - Create group chat
- `PUT /api/chat/rename` - Rename group
- `PUT /api/chat/groupremove` - Remove user from group
- `PUT /api/chat/groupadd` - Add user to group

### Message
- `POST /api/message` - Send a message
- `GET /api/message/:chatId` - Fetch all messages for a chat

### Posts (Social Feed)
- `GET /api/posts` - Fetch all posts
- `POST /api/posts` - Create a new post
- `PUT /api/posts/like` - Like/Unlike a post
- `PUT /api/posts/comment` - Add a comment

### Upload
- `POST /api/upload` - Upload image file
