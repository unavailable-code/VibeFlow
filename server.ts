import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Map of userId -> Set of socketIds
const onlineUsers = new Map<string, Set<string>>();

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // User-specific room for notifications
  socket.on("identify", (userId: string) => {
    socket.join(`user:${userId}`);
    (socket as any).userId = userId;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)!.add(socket.id);

    // Broadcast that this user is online
    io.emit("user-status-changed", { userId, status: "online" });
    console.log(`Socket ${socket.id} identified as user:${userId}`);
  });

  socket.on("get-online-users", () => {
    socket.emit("online-users-list", Array.from(onlineUsers.keys()));
  });

  socket.on("join-room", (data: any) => {
    const roomId = typeof data === "string" ? data : data.roomId;
    const userId = typeof data === "object" ? data.userId : null;
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId} (userId: ${userId})`);
    
    // Notify others (especially host) that a user has joined
    socket.to(roomId).emit("user-joined", { userId, socketId: socket.id });
  });

  socket.on("send-message", ({ roomId, message, user }) => {
    const payload = {
        message,
        user,
        time: Date.now()
    }
    io.to(roomId).emit("receive-message", payload)
  });

  socket.on("disconnect", () => {
    const userId = (socket as any).userId;
    if (userId && onlineUsers.has(userId)) {
      const userSockets = onlineUsers.get(userId)!;
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(userId);
        io.emit("user-status-changed", { userId, status: "offline" });
      }
    }
    console.log("User disconnected", socket.id);
  });

  socket.on("play", ({ roomId, songId, currentTime, timestamp }) => {
    socket.to(roomId).emit("play", { songId, currentTime, timestamp })
  })

  socket.on("pause", ({ roomId, currentTime }) => {
    socket.to(roomId).emit("pause", { currentTime })
  })

  socket.on("lyrics-seek", ({ roomId, currentTime }) => {
    socket.to(roomId).emit("lyrics-seek", { currentTime })
  })

  socket.on("sync-song", ({ roomId, songId, url, currentTime, timestamp }) => {
    socket.to(roomId).emit("sync-song", { songId, url, currentTime, timestamp })
  })

  socket.on("request-sync-to-user", ({ targetSocketId, songId, url, currentTime, timestamp, isPlaying }) => {
    if (targetSocketId) {
      io.to(targetSocketId).emit("sync-song", { songId, url, currentTime, timestamp, isPlaying });
    }
  })

  socket.on("host-left", ({ roomId }) => {
    socket.to(roomId).emit("room-closed")
  })

  // Friends Feature Real-time
  socket.on("send-friend-request", ({ receiverId, request }) => {
    io.to(`user:${receiverId}`).emit("receive-friend-request", request);
  });

  socket.on("accept-friend-request", ({ requesterId, friendship }) => {
    io.to(`user:${requesterId}`).emit("friend-request-accepted", friendship);
  });
});

httpServer.listen(4000, () => {
  console.log("Socket server running on http://localhost:4000");
});