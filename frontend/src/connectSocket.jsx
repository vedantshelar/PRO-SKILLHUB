import { io } from "socket.io-client";
function connectSocket(){
    const socket = io(import.meta.env.VITE_API_SERVER_BASE_URL, {
        withCredentials: true,
      });
    return socket;
}

export default connectSocket;