import { setTool } from "@src/components/widgets/Painting/Painting.slice";
import { useAppDispatch, useAppSelector } from "@src/hooks";

interface IToolButton {
        name: string;
        icon: string;
}

const ToolButton = ({ name, icon }: IToolButton) => {
        const tool = useAppSelector((state) => state.painting.tool);
        const dispatch = useAppDispatch();

        const handleClick = () => {
                dispatch(setTool(name));
        };

        return (
                <button
                        onClick={handleClick}
                        className={`flex box-content gap-1 size-6 p-1 rounded-md border-2 border-transparent ${
                                tool == name ? "bg-amber-100 " : "bg-white hover:border-gray-700"
                        }`}
                        title={name}
                >
                        <img src={`src/assets/icons/${icon}`} height={24} width={24} />
                </button>
        );
};

export default ToolButton;
