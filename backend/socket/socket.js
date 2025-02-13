import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
        credentials: true,
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};


const userSocketMap = {};

export const sendNotification = (userId, notificationData) => {
	console.log(`Sending notification to user ${userId}:`, notificationData);
	io.to(userId).emit("newNotification", notificationData);
};

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;
	
	socket.on("joinRoom", (userId) => {
        console.log(`User ${userId} joined their notification room`);
        socket.join(userId);  // Join room based on user ID
    });

	 const sendNotification = (userId, notificationData) => {
		console.log(`Sending notification to user ${userId}:`, notificationData);
		io.to(userId).emit("newNotification", notificationData);
	};

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };