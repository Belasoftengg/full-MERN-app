import { io } from "socket.io-client";

const URL = "http://localhost:5000";

export function createSocket() {
  // withCredentials not required for ws, but CORS is configured on server
  const socket = io(URL, { withCredentials: true });
  return socket;
}
