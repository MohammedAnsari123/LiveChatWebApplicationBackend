const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { setupSocket } = require("./socket/socket");

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

const normalizeOrigin = (url) => url ? url.replace(/\/$/, "") : "";

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://modren-live-chat-web-application.vercel.app",
    "https://live-chat-web-application-frontend.vercel.app",
    normalizeOrigin(process.env.FRONTEND_URL),
    normalizeOrigin(process.env.ADMIN_FRONTEND_URL),
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Basic Route
app.get("/", (req, res) => {
    res.send("API is Running Successfully");
});

// Routes (to be imported)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));

// Initialize Socket.io
setupSocket(server, allowedOrigins);
