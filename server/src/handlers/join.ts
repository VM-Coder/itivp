import { Socket } from "socket.io";
import { roomStore } from "../stores/room_store.ts";
import { sessionStore } from "../stores/session_store.ts";
import { io } from "../../io.ts";

export const joinHandler = (
        socket: Socket,
        session: {
                nickname: string | null;
                room: string | null;
                points: number;
        },
        data: any,
) => {
        if (session.room) {
                socket.emit(
                        "response",
                        JSON.stringify({
                                type: "error",
                                error: "Player already joined",
                        }),
                );
                return;
        }

        let available = roomStore.available();

        if (!available) {
                available = roomStore.create();
        }

        socket.join(available.name);

        available = roomStore.join(available.name, socket);

        sessionStore.update(socket.handshake.auth.sessionID, {
                nickname: data.nickname,
                room: available.name,
                points: 0,
        });

        io.to(available.name).emit(
                "response",
                JSON.stringify({
                        type: "found",
                        name: available.name,
                        count: available.players.length,
                }),
        );

        // console.log("Sessions: ");
        // console.log(sessionStore.sessions);
        // console.log("Rooms: ");
        // console.log(roomStore.rooms);
};
