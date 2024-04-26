import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:8080"; // Remplacez par l'URL de votre serveur Socket.IO

const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"], // Forcer l'utilisation du transport WebSocket
});

export const connectSocket = () => {
  socket.connect();
};

export default socket;
