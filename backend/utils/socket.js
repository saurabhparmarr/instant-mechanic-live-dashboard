const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("join:operations", () => {
      socket.join("operations");

      console.log(`📡 ${socket.id} joined operations room`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};

const emitOperationUpdate = (event, data) => {
  getIO().to("operations").emit(event, data);
};

module.exports = {
  initSocket,
  getIO,
  emitOperationUpdate,
};