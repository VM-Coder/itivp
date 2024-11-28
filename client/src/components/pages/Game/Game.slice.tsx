import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IGameState {
        role: "painter" | "responder";
        wordData: {
                hashes: {
                        md5: string;
                        sha1: string;
                };
                length: number;
                word: string;
        };

        responded: Array<string>;
        chatActive: boolean;
}

const initialState: IGameState = {
        role: "responder",
        wordData: {
                hashes: {
                        md5: "",
                        sha1: "",
                },
                length: 0,
                word: "",
        },
        responded: [],
        chatActive: true,
};

export const GameSlice = createSlice({
        name: "game",
        initialState,
        reducers: {
                setRole: (state, action: PayloadAction<"painter" | "responder">) => {
                        state.role = action.payload;
                },
                setWordData: (state, action: PayloadAction<{ hashes: { md5: string; sha1: string }; length: number; word: string }>) => {
                        state.wordData = action.payload;
                },
                setResponded: (state, action: PayloadAction<Array<string>>) => {
                        state.responded = action.payload;
                },
                setChatActive: (state, action: PayloadAction<boolean>) => {
                        state.chatActive = action.payload;
                },
        },
});

export const { setRole, setWordData, setResponded, setChatActive } = GameSlice.actions;

export default GameSlice.reducer;
