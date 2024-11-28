import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IResultState {
        result: Array<{
                place: number;
                nickname: string;
                points: number;
        }>;
}

const initialState: IResultState = {
        result: [],
};

export const ResultSlice = createSlice({
        name: "result",
        initialState,
        reducers: {
                setResult: (
                        state,
                        action: PayloadAction<
                                Array<{
                                        place: number;
                                        nickname: string;
                                        points: number;
                                }>
                        >,
                ) => {
                        state.result = action.payload;
                },
        },
});

export const { setResult } = ResultSlice.actions;

export default ResultSlice.reducer;
