import { Server } from "socket.io";
import { createServer } from "http";

export const server = createServer();

export const io = new Server(server, {
        cors: {
                origin: "http://localhost:5173",
        },
});
