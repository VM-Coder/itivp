import ToolButton from "@shared/buttons/ToolButton";
import { data } from "@entities/Toolbar/Toolbar";
import { useAppDispatch, useAppSelector } from "@src/hooks";
import { setLineWidth } from "../Painting/Painting.slice";
import { ChangeEvent } from "react";

const Toolbar = () => {
        const lineWidth = useAppSelector((state) => state.painting.lineWidth);
        const dispatch = useAppDispatch();

        const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
                dispatch(setLineWidth(Number(event.target.value)));
        };

        return (
                <div className='rounded-2xl flex flex-row fixed right-5 inset-y-0 my-auto size-min gap-1 p-5 bg-gray-200'>
                        <div className='flex flex-col gap-1'>
                                {data.shapes.map((elem, i) => {
                                        return <ToolButton key={i} name={elem.name} icon={elem.icon} />;
                                })}
                        </div>
                        <div className='flex flex-col gap-1'>
                                {data.tools.map((elem, i) => {
                                        return <ToolButton key={i} name={elem.name} icon={elem.icon} />;
                                })}
                        </div>

                        <input
                                value={lineWidth}
                                min={2}
                                step={1}
                                max={25}
                                onChange={handleInput}
                                type='range'
                                className='absolute h-auto top-[45%] right-16 rotate-90'
                        />
                        <label className='absolute h-full right-16 top-full w-[120%] text-2xl'>{lineWidth}</label>
                </div>
        );
};

export default Toolbar;
