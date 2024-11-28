import { randomUUID } from "crypto";
import { io, server } from "./io.ts";

import { roomStore } from "./src/stores/room_store.js";
import { sessionStore } from "./src/stores/session_store.js";
import { joinHandler } from "./src/handlers/join.js";
import { drawHandler } from "./src/handlers/draw.ts";
import { guessHandler } from "./src/handlers/guess.ts";

io.use((socket, next) => {
        const sessionID = socket.handshake.auth.sessionID;

        if (sessionID) {
                const session = sessionStore.find(sessionID);

                if (session) {
                        socket.handshake.auth.session = session;

                        next();
                }
        }

        socket.handshake.auth.sessionID = randomUUID();
        sessionStore.add(socket.handshake.auth.sessionID);
        next();
});

io.on("connection", (socket) => {
        socket.on("request", (data) => {
                data = JSON.parse(data);

                const session = sessionStore.find(socket.handshake.auth.sessionID);

                switch (data.type) {
                        case "join":
                                joinHandler(socket, session, data);
                                break;
                        case "draw":
                                drawHandler(socket, session, data);
                                break;
                        case "guess":
                                guessHandler(socket, session, data);
                                break;
                }
        });

        socket.on("disconnecting", () => {
                const sessionID = socket.handshake.auth.sessionID;

                const room = sessionStore.find(sessionID).room;

                if (roomStore.waiting.includes(room)) {
                        roomStore.kick(room, sessionID);
                        sessionStore.delete(sessionID);

                        if (roomStore.rooms[room]) {
                                socket.to(room).emit(
                                        "response",
                                        JSON.stringify({
                                                type: "found",
                                                name: room,
                                                count: roomStore.rooms[room].players.length,
                                        }),
                                );
                        }
                } else {
                        setTimeout(() => {
                                sessionStore.delete(sessionID);
                        }, 600000);
                }
        });

        socket.emit(
                "response",
                JSON.stringify({
                        type: "auth",
                        sessionID: socket.handshake.auth.sessionID,
                }),
        );
});

server.listen(3000);
