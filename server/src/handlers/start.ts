import { sessionStore } from "../stores/session_store.ts";
import { io } from "../../io.ts";
import { roomStore } from "../stores/room_store.ts";
import { createHash } from "crypto";
import { words } from "../words.ts";

export const start = (name: string) => {
        setTimeout(async () => {
                io.to(name).emit(
                        "response",
                        JSON.stringify({
                                type: "play",
                        }),
                );

                const sockets = await io.sockets.in(name).fetchSockets();

                for (let i = 0; i < 5; i++) {
                        await new Promise<void>((resolve) =>
                                setTimeout(() => {
                                        resolve();
                                }, 1000),
                        );

                        let time = 60000;

                        roomStore.rooms[name].round = [];
                        roomStore.rooms[name].painter = roomStore.rooms[name].players[i];

                        const word = words[Math.floor(words.length * Math.random())];
                        roomStore.rooms[name].word = word;

                        for (const socket of sockets) {
                                if (socket.handshake.auth.sessionID == roomStore.rooms[name].painter) {
                                        socket.emit(
                                                "response",
                                                JSON.stringify({
                                                        type: "go",
                                                        role: "painter",
                                                        word: word,
                                                }),
                                        );
                                } else {
                                        socket.emit(
                                                "response",
                                                JSON.stringify({
                                                        type: "go",
                                                        role: "responder",
                                                        md5: createHash("md5").update(word).digest("hex").toString(),
                                                        sha1: createHash("sha1").update(word).digest("hex").toString(),
                                                        length: word.length,
                                                        painter: sessionStore.sessions[roomStore.rooms[name].painter].nickname,
                                                }),
                                        );
                                }
                        }

                        await new Promise<void>((resolve) => {
                                const interval = setInterval(() => {
                                        if (!roomStore.rooms[name]) {
                                                clearInterval(interval);
                                                resolve();
                                        }

                                        io.to(name).emit(
                                                "response",
                                                JSON.stringify({
                                                        type: "sync",
                                                        time: time,
                                                }),
                                        );
                                        time -= 500;

                                        if (time < 0 || roomStore.rooms[name]?.round.length == 4) {
                                                clearInterval(interval);
                                                io.to(name).emit(
                                                        "response",
                                                        JSON.stringify({
                                                                type: "stop",
                                                        }),
                                                );
                                                resolve();
                                        }
                                }, 500);
                        });

                        if (!roomStore.rooms[name]) return;
                }

                if (roomStore.rooms[name]) {
                        const leaderboard = roomStore.rooms[name].players
                                .map((sessionID) => {
                                        return {
                                                nickname: sessionStore.sessions[sessionID].nickname,
                                                points: sessionStore.sessions[sessionID].points,
                                        };
                                })
                                .sort((x, y) => {
                                        return Math.sign(y.points - x.points);
                                });

                        const places = [
                                ...new Set(
                                        leaderboard.map((player) => {
                                                return player.points;
                                        }),
                                ),
                        ];

                        const result = leaderboard.map((player) => {
                                return {
                                        place: places.indexOf(player.points) + 1,
                                        nickname: player.nickname,
                                        points: player.points,
                                };
                        });

                        io.to(name).emit(
                                "response",
                                JSON.stringify({
                                        type: "result",
                                        result: result,
                                }),
                        );

                        roomStore.rooms[name].players.map((sessionID) => {
                                roomStore.kick(name, sessionID);
                                sessionStore.sessions[sessionID] = {
                                        nickname: null,
                                        room: null,
                                        points: 0,
                                };
                        });
                }
        }, 1000);
};
