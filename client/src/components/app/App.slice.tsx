import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAppState {
        page: string;
        nickname: string;
}

const initialState: IAppState = {
        page: "main",
        nickname: "",
};

export const AppSlice = createSlice({
        name: "app",
        initialState,
        reducers: {
                setPage: (state, action: PayloadAction<string>) => {
                        state.page = action.payload;
                },
                setNickname: (state, action: PayloadAction<string>) => {
                        state.nickname = action.payload;
                },
        },
});

export const { setPage, setNickname } = AppSlice.actions;

export default AppSlice.reducer;
