import { Socket } from "socket.io";
import { roomStore } from "../stores/room_store.ts";
import { sessionStore } from "../stores/session_store.ts";
import { io } from "../../io.ts";

export const guessHandler = (
        socket: Socket,
        session: {
                nickname: string | null;
                room: string | null;
                points: number;
        },
        data: any,
) => {
        const sessionID = socket.handshake.auth.sessionID;
        if (session.room) {
                if (roomStore.rooms[session.room].painter != sessionID) {
                        if (roomStore.rooms[session.room].round.indexOf(sessionID) == -1) {
                                if (roomStore.rooms[session.room].word == data.word) {
                                        roomStore.rooms[session.room].round.push(sessionID);
                                        sessionStore.sessions[sessionID].points += 5 - roomStore.rooms[session.room].round.length;
                                        sessionStore.sessions[String(roomStore.rooms[session.room].painter)].points += 1;

                                        socket.emit(
                                                "response",
                                                JSON.stringify({
                                                        type: "guess",
                                                        guessed: true,
                                                }),
                                        );

                                        io.to(session.room).emit(
                                                "response",
                                                JSON.stringify({
                                                        type: "responded",
                                                        list: roomStore.rooms[session.room].round.map((elem: string) => {
                                                                return sessionStore.sessions[elem].nickname;
                                                        }),
                                                }),
                                        );
                                } else {
                                        socket.emit(
                                                "response",
                                                JSON.stringify({
                                                        type: "guess",
                                                        guessed: false,
                                                }),
                                        );
                                }
                        } else {
                                socket.emit(
                                        "response",
                                        JSON.stringify({
                                                type: "error",
                                                message: "You've already guessed",
                                        }),
                                );
                        }
                } else {
                        socket.emit(
                                "response",
                                JSON.stringify({
                                        type: "error",
                                        message: "You're a painter",
                                }),
                        );
                }
        } else {
                socket.emit(
                        "response",
                        JSON.stringify({
                                type: "error",
                                message: "Room wasn't found",
                        }),
                );
        }
};
