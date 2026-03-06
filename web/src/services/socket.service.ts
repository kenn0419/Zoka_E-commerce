import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket() {
  const BE_URL = import.meta.env.VITE_API_URL;
  if (!socket) {
    socket = io(BE_URL + "/chat", {
      transports: ["websocket"],
      withCredentials: true,
    });
  }

  socket.on("connect", () => {
    console.log("✅ WS connected", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ WS connect error", err.message);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
