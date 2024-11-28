import { useEffect, useRef, useState } from "react";
import { socket } from "@src/socket";
import { useAppDispatch, useAppSelector } from "@src/hooks";
import { setPage } from "@src/components/app/App.slice";

enum STATUS {
        WAIT = 0,
        READY = 1,
        PLAY = 2,
}

const Loading = () => {
        const nickname = useAppSelector((state) => state.app.nickname);
        const dispatch = useAppDispatch();

        const [room, setRoom] = useState(false);
        const [wait, setWait] = useState(1);
        const [players, setPlayers] = useState(0);
        const [status, setStatus] = useState(STATUS.WAIT);

        const interval = useRef<NodeJS.Timeout | null>(null);

        useEffect(() => {
                if (socket.connected) {
                        socket.emit(
                                "request",
                                JSON.stringify({
                                        type: "join",
                                        nickname: nickname,
                                }),
                        );

                        socket.on("response", (data) => {
                                data = JSON.parse(data);

                                if (data.error) {
                                        console.log(data.error);
                                } else {
                                        switch (data.type) {
                                                case "found":
                                                        setRoom(true);
                                                        setPlayers(data.count);
                                                        break;
                                                case "ready":
                                                        setStatus(STATUS.READY);
                                                        break;
                                                case "play":
                                                        setStatus(STATUS.PLAY);
                                                        dispatch(setPage("game"));
                                                        break;
                                        }
                                }
                        });
                }

                interval.current = setInterval(() => {
                        setWait((val) => {
                                return (val % 3) + 1;
                        });
                }, 1000);

                return () => {
                        if (interval.current) {
                                clearInterval(interval.current);
                        }
                };
        }, []);

        return (
                <div className='fixed w-screen h-screen bg-yellow-400'>
                        <div className='absolute w-fit h-fit inset-0 m-auto'>
                                {status != STATUS.PLAY && (
                                        <>
                                                <h2 className='bold text-8xl'>Ожидание{".".repeat(wait)}</h2>
                                                <p className='font-semibold text-3xl text-stone-500'>
                                                        {!room && <>Поиск комнаты</>}
                                                        {room && (
                                                                <>
                                                                        <span>Комната найдена</span>
                                                                        <br />
                                                                        <span>
                                                                                {status == STATUS.WAIT && (
                                                                                        <>
                                                                                                Ожидание игроков{" "}
                                                                                                <span className='font-bold text-stone-700'>{players}/5</span>
                                                                                        </>
                                                                                )}
                                                                                {status == STATUS.READY && <>Подготовка</>}
                                                                        </span>
                                                                </>
                                                        )}
                                                </p>
                                        </>
                                )}
                                {status == STATUS.PLAY && <h2 className='bold text-8xl'>Старт игры</h2>}
                        </div>
                </div>
        );
};

export default Loading;
