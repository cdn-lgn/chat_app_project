import express from "express";
import {
  adminLogin,
  adminLogout,
  allChats,
  allMessages,
  allUsers,
  getAdminData,
  getDashboardStats,
} from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// Route to verify admin login
app.post("/verify", adminLoginValidator(), validateHandler, adminLogin);

// Route to logout admin
app.get("/logout", adminLogout);

// Only Admin Can Access these Routes

app.use(adminOnly);

// Route to fetch admin data
app.get("/", getAdminData);

// Route to fetch all users
app.get("/users", allUsers);

// Route to fetch all chats
app.get("/chats", allChats);

// Route to fetch all messages
app.get("/messages", allMessages);

// Route to fetch dashboard statistics
app.get("/stats", getDashboardStats);

export default app;
