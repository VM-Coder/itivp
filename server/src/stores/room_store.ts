import { Socket } from "socket.io";
import { start } from "../handlers/start.ts";
import { io } from "../../io.ts";

interface IroomStore {
        counter: number;
        rooms: {
                [key: string]: {
                        name: string;
                        players: Array<string>;
                        painter: null | string;
                        word: null | string;
                        round: Array<string>;
                };
        };
        waiting: Array<string>;

        create: Function;
        available: Function;
        join: Function;
        remove: Function;
        kick: Function;
}

export const roomStore: IroomStore = {
        counter: 0,
        rooms: {},
        waiting: [],

        create: function () {
                if (this.counter == 4294967295) {
                        this.counter = 0;
                }

                const name = this.counter.toString();

                this.counter++;

                this.rooms[name] = {
                        name: name,
                        players: [],
                        painter: null,
                        word: null,
                        round: [],
                };

                this.waiting.push(name);

                return this.rooms[name];
        },
        available: function () {
                return this.rooms[this.waiting[0]];
        },
        join: function (name: string, socket: Socket) {
                this.rooms[name].players.push(socket.handshake.auth.sessionID);

                if (this.rooms[name].players.length == 5) {
                        start(name);
                        this.waiting = this.waiting.filter((x) => x != name);
                        io.to(name).emit(
                                "response",
                                JSON.stringify({
                                        type: "ready",
                                }),
                        );
                }

                return this.rooms[name];
        },
        remove: function (name: string) {
                delete this.rooms[name];
                this.waiting = this.waiting.filter((x) => x != name);
        },
        kick: function (room: string, sessionID: string) {
                this.rooms[room].players = this.rooms[room].players.filter((x) => x != sessionID);

                if (this.rooms[room].players.length == 0) {
                        this.remove(room);
                }
        },
};
