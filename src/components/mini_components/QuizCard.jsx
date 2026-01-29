import { X } from "lucide-react";

const QuizCard = () => {
    return (
        <div className="bg-modal-info relative w-2xl flex flex-col gap-2 items-center text-center text-surface-base rounded-3xl p-6">
            <button className="absolute top-4 right-4 p-1 hover:bg-button-secondary cursor-pointer rounded-full"><X size={18} /></button>
            <div className="heading font-bold">Quiz Time</div>
            <div className="subText">You’ve read 3 articles in Politics. A quick quiz could help lock it in. Score high to climb the leader board.</div>
            <button className="bg-button-secondary cursor-pointer rounded-xl w-2/5 py-2"> Take Quiz</button>
        </div>
    )
}

export default QuizCard;