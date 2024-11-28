interface IGuessRecord {
        nickname: string;
        place: number;
}

const colors = ["text-yellow-400", "text-slate-400", "text-red-500"];

const GuessRecord = ({ nickname, place }: IGuessRecord) => {
        const color = place < 3 ? colors[place] : "text-black";

        return (
                <p className={`${color} text-right text-2xl pr-4`}>
                        Игрок {nickname} отгадывает слово и занимает {place + 1}-е место
                </p>
        );
};

export default GuessRecord;
