import ColorButton from "@shared/buttons/ColorButton";
import { useAppDispatch, useAppSelector } from "@src/hooks";
import { IColor, setFirstColor, setSecondColor } from "@widgets/Painting/Painting.slice";
import { data } from "@src/components/entities/Palette/Palette";

const Palette = () => {
        const dispatch = useAppDispatch();
        const firstColor: IColor = useAppSelector((state) => state.painting.firstColor);
        const secondColor: IColor = useAppSelector((state) => state.painting.secondColor);

        return (
                <div className='rounded-2xl flex flex-col fixed left-5 inset-y-0 my-auto size-min gap-1 p-5 bg-gray-200'>
                        {data.map((elem, i) => {
                                return (
                                        <div key={i} className='flex gap-1'>
                                                <ColorButton
                                                        color={elem.twColor}
                                                        clickHandle={() => {
                                                                dispatch(setFirstColor(elem));
                                                        }}
                                                />
                                                <ColorButton
                                                        color={elem.twColor}
                                                        clickHandle={() => {
                                                                dispatch(setSecondColor(elem));
                                                        }}
                                                />
                                        </div>
                                );
                        })}
                        <div className='flex gap-1 mt-10'>
                                <div className={`block rounded-full size-6 p-0 ${firstColor.twColor}`}></div>
                                <div className={`block rounded-full size-6 p-0 ${secondColor.twColor}`}></div>
                        </div>
                </div>
        );
};

export default Palette;
