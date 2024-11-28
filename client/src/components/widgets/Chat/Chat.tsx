import GuessRecord from "@src/components/shared/text/GuessRecord";
import { useAppSelector } from "@src/hooks";
import { socket } from "@src/socket";
import { useEffect, useRef, useState } from "react";
import { md5 } from "js-md5";
import { sha1 } from "js-sha1";

const Chat = () => {
        const responded = useAppSelector((state) => state.game.responded);
        const wordData = useAppSelector((state) => state.game.wordData);
        const chatActive = useAppSelector((state) => state.game.chatActive);
        const role = useAppSelector((state) => state.game.role);

        const input = useRef<HTMLInputElement>(null);

        const [value, setValue] = useState("");
        const [wrong, setWrong] = useState(false);

        useEffect(() => {
                setWrong(false);
                setValue(role == "painter" ? wordData.word : "_".repeat(wordData.length));
        }, [role, wordData]);

        useEffect(() => {
                if (input.current) {
                        const pos = value.replaceAll("_", "").length;
                        input.current.setSelectionRange(pos, pos);
                }
        }, [value]);

        const inputHandle = (event: React.FormEvent<HTMLInputElement>) => {
                const current = event.currentTarget.value.replaceAll("_", "");

                if (current.length > wordData.length) return;

                setWrong(false);

                if (current.length == wordData.length) {
                        if (md5(current) == wordData.hashes.md5 && sha1(current) == wordData.hashes.sha1) {
                                socket.emit(
                                        "request",
                                        JSON.stringify({
                                                type: "guess",
                                                word: current,
                                        }),
                                );
                        } else {
                                setWrong(true);
                        }
                }

                const pos = current.length;
                event.currentTarget.setSelectionRange(pos, pos);
                setValue(current + "_".repeat(wordData.length - current.length));
        };

        return (
                <div className='fixed bottom-0 w-full'>
                        {responded.map((elem, i) => {
                                return <GuessRecord key={i} nickname={elem} place={i} />;
                        })}
                        <input
                                ref={input}
                                className={`rounded-3xl border-2 h-12 w-[360px] mb-5 text-center text-2xl tracking-[1rem] ${
                                        wrong ? "border-red-500 focus:border-red-500 focus:outline-none" : "border-black"
                                }`}
                                value={value}
                                type='text'
                                disabled={!chatActive}
                                onInput={inputHandle}
                        />
                </div>
        );
};

export default Chat;
