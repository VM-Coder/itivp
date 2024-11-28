import { setPage, setNickname } from "@src/components/app/App.slice";
import { useAppDispatch } from "@src/hooks";
import { socket } from "@src/socket";
import { useEffect, useState } from "react";

const Main = () => {
        const dispatch = useAppDispatch();

        const [value, setValue] = useState("");
        const [wrong, setWrong] = useState(false);

        const inputHandle = (event: React.FormEvent<HTMLInputElement>) => {
                setWrong(false);
                setValue(event.currentTarget.value);
        };

        const clickHandle = () => {
                if (value == "") {
                        setWrong(true);
                } else {
                        dispatch(setNickname(value));
                        dispatch(setPage("loading"));
                }
        };

        useEffect(() => {
                socket.on("response", (data) => {
                        data = JSON.parse(data);

                        if (data.type == "auth") {
                                socket.auth = {
                                        token: data.sessionID,
                                };
                        }
                });
        }, []);

        return (
                <div className='fixed w-full h-full z-10 bg-white'>
                        <div className='h-full w-full bg-[url("assets/images/bg.jpg")] bg-[size:75%] bg-center opacity-25'></div>
                        <div className='absolute w-fit h-fit inset-0 mt-48 mx-auto'>
                                <h1 className='text-9xl'>PAINT.IO</h1>
                                <div className='flex gap-4 my-24'>
                                        <input
                                                className={`rounded-lg text-3xl p-4 border-2 focus:bg-slate-50 outline-none 
                                                        ${wrong ? "border-red-500" : "border-yellow-500"}
                                                `}
                                                value={value}
                                                maxLength={32}
                                                onChange={inputHandle}
                                                placeholder='Введите никнейм'
                                        />
                                        <button
                                                className='rounded-lg text-3xl p-4 border-2 border-yellow-500 bg-yellow-500 hover:bg-white hover:text-black'
                                                onClick={clickHandle}
                                        >
                                                Начать игру
                                        </button>
                                </div>
                        </div>
                        <p className='absolute bottom-5 right-5 text-2xl font-bold'>
                                Designed by&nbsp;
                                <a
                                        className='text-sky-500 hover:text-yellow-500'
                                        target='_blank'
                                        href='https://ru.freepik.com/free-vector/hand-drawn-flat-abstract-shape-collection_18006664.htm#fromView=search&page=1&position=2&uuid=1f23edbd-e5c8-4b84-9f99-75f135bdeeb4'
                                >
                                        Freepik
                                </a>
                        </p>
                </div>
        );
};

export default Main;
