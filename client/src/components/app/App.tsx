import "./App.css";
import { useAppSelector } from "@src/hooks";

import Main from "@pages/Main/Main";
import Loading from "@pages/Loading/Loading";
import Game from "@pages/Game/Game";
import Result from "@pages/Result/Result";
import { animated, useTransition } from "@react-spring/web";

const pages: { [key: string]: JSX.Element } = {
        main: <Main />,
        loading: <Loading />,
        game: <Game />,
        result: <Result />,
};

const App = () => {
        const page = useAppSelector((state) => state.app.page);

        const transition = useTransition(page, {
                from: { transform: "translateY(-100%)" },
                enter: { transform: "translateY(0)" },
                leave: { transform: "translateY(0)" },
        });

        return transition((style, item) => (
                <animated.div className='fixed w-full h-full' style={style}>
                        {pages[item]}
                </animated.div>
        ));
};

export default App;
