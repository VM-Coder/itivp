import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IColor {
        rgb: string;
        twColor: string;
}

export interface IPaintingState {
        firstColor: IColor;
        secondColor: IColor;
        tool: string;
        lineWidth: number;
}

const initialState: IPaintingState = {
        firstColor: {
                rgb: "0,0,0",
                twColor: "bg-black",
        },
        secondColor: {
                rgb: "255,255,255",
                twColor: "bg-white",
        },
        tool: "",
        lineWidth: 3,
};

export const PaintingSlice = createSlice({
        name: "painting",
        initialState,
        reducers: {
                setFirstColor: (state: IPaintingState, action: PayloadAction<IColor>) => {
                        state.firstColor = action.payload;
                },
                setSecondColor: (state: IPaintingState, action: PayloadAction<IColor>) => {
                        state.secondColor = action.payload;
                },
                setTool: (state: IPaintingState, action: PayloadAction<string>) => {
                        state.tool = action.payload;
                },
                setLineWidth: (state: IPaintingState, action: PayloadAction<number>) => {
                        state.lineWidth = action.payload;
                },
        },
});

export const { setFirstColor, setSecondColor, setTool, setLineWidth } = PaintingSlice.actions;

export default PaintingSlice.reducer;
