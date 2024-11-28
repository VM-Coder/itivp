import { setPage } from "@src/components/app/App.slice";
import { useAppDispatch, useAppSelector } from "@src/hooks";

const colors = ["bg-yellow-400", "bg-slate-400", "bg-red-500"];

const Result = () => {
        const result = useAppSelector((state) => state.result.result);
        const dispatch = useAppDispatch();

        const clickHandle = () => {
                dispatch(setPage("main"));
        };

        return (
                <div className='fixed w-screen h-screen bg-yellow-400 z-0'>
                        <div className='absolute w-full h-fit inset-0 m-auto'>
                                <h2 className='bold text-8xl mb-5'>Результаты</h2>
                                <table className='rounded-3xl p-5 w-1/2 h-fit inset-0 m-auto bg-white overflow-hidden'>
                                        <thead>
                                                <tr className='bg-slate-500'>
                                                        <th className='font-bold p-5 text-4xl text-sky-50'>🏆</th>
                                                        <th className='font-bold p-5 text-4xl text-sky-50'>Игрок</th>
                                                        <th className='font-bold p-5 text-4xl text-sky-50'>Балл</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                {result.map((elem, i) => {
                                                        const color = elem.place < 4 ? colors[elem.place - 1] + " text-white" : "text-black";

                                                        return (
                                                                <tr key={i} className={i % 2 ? "bg-slate-200" : "bg-slate-100"}>
                                                                        <td className='w-1/6 p-5 text-3xl'>
                                                                                <div
                                                                                        className={
                                                                                                "flex items-center justify-center m-auto rounded-full w-8 h-8 pr-1 " +
                                                                                                color
                                                                                        }
                                                                                >
                                                                                        {elem.place}
                                                                                </div>
                                                                        </td>
                                                                        <td className='w-1/2 p-5 text-3xl'>{elem.nickname}</td>
                                                                        <td className='w-1/3 p-5 text-3xl'>{elem.points}</td>
                                                                </tr>
                                                        );
                                                })}
                                        </tbody>
                                </table>
                        </div>
                        <a className='rounded-xl absolute bottom-5 left-5 text-3xl hover:text-slate-500 cursor-pointer' onClick={clickHandle}>
                                Главная
                        </a>
                </div>
        );
};

export default Result;
