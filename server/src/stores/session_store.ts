interface IsessionStore {
        sessions: {
                [key: string]: {
                        nickname: string | null;
                        room: string | null;
                        points: number;
                };
        };

        add: Function;
        find: Function;
        update: Function;
        delete: Function;
}

export const sessionStore: IsessionStore = {
        sessions: {},

        add: function (sessionID: string) {
                this.sessions[sessionID] = {
                        nickname: null,
                        room: null,
                        points: 0,
                };
        },
        find: function (sessionID: string) {
                return this.sessions[sessionID];
        },
        update: function (sessionID: string, data: { nickname: string; room: string; points: number }) {
                Object.assign(this.sessions[sessionID], data);
        },
        delete: function (sessionID: string) {
                delete this.sessions[sessionID];
        },
};
