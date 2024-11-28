import Canvas, { CanvasRef } from "@widgets/Canvas/Canvas";
import Painting from "@src/components/widgets/Painting/Painting";
import Chat from "@src/components/widgets/Chat/Chat";
import { useEffect, useRef, useState } from "react";
import { socket } from "@src/socket";
import { useAppDispatch, useAppSelector } from "@src/hooks";
import { setChatActive, setResponded, setRole, setWordData } from "./Game.slice";
import { setPage } from "@src/components/app/App.slice";
import { setResult } from "../Result/Result.slice";

const Game = () => {
        const role = useAppSelector((state) => state.game.role);
        const dispatch = useAppDispatch();

        const [painter, setPainter] = useState(null);

        const progressBar = useRef<HTMLDivElement | null>(null);
        const canvas = useRef<CanvasRef | null>(null);

        useEffect(() => {
                socket.on("response", (data) => {
                        data = JSON.parse(data);

                        switch (data.type) {
                                case "go":
                                        dispatch(setResponded([]));
                                        dispatch(setRole(data.role));
                                        if (data.role == "responder") {
                                                setPainter(data.painter);
                                                dispatch(
                                                        setWordData({
                                                                hashes: {
                                                                        md5: data.md5,
                                                                        sha1: data.sha1,
                                                                },
                                                                length: data.length,
                                                                word: "",
                                                        }),
                                                );
                                                dispatch(setChatActive(true));
                                        } else if (data.role == "painter") {
                                                setPainter(null);
                                                dispatch(
                                                        setWordData({
                                                                hashes: {
                                                                        md5: "",
                                                                        sha1: "",
                                                                },
                                                                length: 0,
                                                                word: data.word,
                                                        }),
                                                );
                                                dispatch(setChatActive(false));
                                        }
                                        break;
                                case "sync":
                                        if (progressBar.current) {
                                                progressBar.current.style.width = data.time / 600 + "%";
                                        }
                                        break;
                                case "draw":
                                        if (canvas.current) {
                                                canvas.current.drawFromData(data);
                                        }
                                        break;
                                case "guess":
                                        dispatch(setChatActive(false));
                                        break;
                                case "responded":
                                        dispatch(setResponded(data.list));
                                        break;
                                case "result":
                                        dispatch(setResult(data.result));
                                        dispatch(setPage("result"));
                                        break;
                        }
                });
        }, []);

        return (
                <div className='w-full h-full bg-slate-100'>
                        <div className='fixed top-0 inset-x-0 m-auto rounded-b-3xl w-1/3 h-9 bg-yellow-500'>
                                <div className='rounded-xl absolute inset-0 m-auto w-11/12 h-3 bg-zinc-300 overflow-hidden'>
                                        <div ref={progressBar} className='h-3 bg-indigo-600'></div>
                                </div>
                        </div>
                        {painter && (
                                <p className='absolute top-5 right-5 text-3xl font-bold'>
                                        Рисует <span className='text-slate-500'>{painter}</span>
                                </p>
                        )}
                        {role == "painter" && <Painting />}
                        <Chat />
                        <Canvas ref={canvas} width={640} height={360} />
                </div>
        );
};

export default Game;
