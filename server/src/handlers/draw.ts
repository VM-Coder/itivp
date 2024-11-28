import { Socket } from "socket.io";
import { roomStore } from "../stores/room_store.ts";
import { io } from "../../io.ts";

export const drawHandler = (
        socket: Socket,
        session: {
                nickname: string | null;
                room: string | null;
                points: number;
        },
        data: any,
) => {
        if (session.room) {
                if (roomStore.rooms[session.room].painter == socket.handshake.auth.sessionID) {
                        socket.to(session.room).emit(
                                "response",
                                JSON.stringify({
                                        type: "draw",
                                        tool: data.tool,
                                        options: data.options,
                                }),
                        );
                } else {
                        socket.emit(
                                "response",
                                JSON.stringify({
                                        type: "error",
                                        message: "You're not a painter",
                                }),
                        );
                }
        } else {
                socket.emit(
                        "response",
                        JSON.stringify({
                                type: "error",
                                message: "Room isn't found",
                        }),
                );
        }
};
