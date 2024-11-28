import { useAppSelector } from "@src/hooks";
import Palette from "../Palette/Palette";
import Toolbar from "../Toolbar/Toolbar";
import { animated, useTransition } from "@react-spring/web";
import { useEffect, useState } from "react";

const Painting = () => {
        const wordData = useAppSelector((state) => state.game.wordData);
        const [splash, setSplash] = useState(false);

        const transition = useTransition(splash, {
                from: { translateX: "100%", opacity: 0 },
                enter: { translateX: "0", opacity: 1 },
                leave: { translateX: "-100%", opacity: 0 },
                config: { duration: 50 },
        });

        useEffect(() => {
                setSplash(true);
                const timeout = setTimeout(() => {
                        setSplash(false);
                }, 1000);

                return () => {
                        clearTimeout(timeout);
                };
        }, []);

        return (
                <>
                        <Palette />
                        <Toolbar />
                        {transition((style, item) => {
                                return (
                                        item && (
                                                <animated.h1 style={style} className='fixed inset-0 m-auto h-fit text-8xl z-10 pointer-events-none'>
                                                        Загаданное слово:
                                                        <br />
                                                        {wordData.word}
                                                </animated.h1>
                                        )
                                );
                        })}
                </>
        );
};

export default Painting;
