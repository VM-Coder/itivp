import { configureStore } from "@reduxjs/toolkit";
import appReducer from "@app/App.slice";
import gameReducer from "@pages/Game/Game.slice";
import paintingReducer from "@widgets/Painting/Painting.slice";
import resultReducer from "@pages/Result/Result.slice";

export const store = configureStore({
        reducer: {
                app: appReducer, //состояние приложения (меню -> загрузка -> игра -> результаты)
                game: gameReducer, //состояние экрана игры
                painting: paintingReducer, //состояние холста для художника
                result: resultReducer,
        },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
