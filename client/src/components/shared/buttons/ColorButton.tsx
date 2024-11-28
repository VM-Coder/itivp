import { MouseEventHandler } from "react";

interface IColorButton {
        color: string;
        clickHandle: MouseEventHandler;
}

const ColorButton = ({ color, clickHandle }: IColorButton) => {
        return <button onClick={clickHandle} className={`block rounded-full size-6 p-0 hover:border-gray-200 hover:border-2 ${color}`}></button>;
};

export default ColorButton;
