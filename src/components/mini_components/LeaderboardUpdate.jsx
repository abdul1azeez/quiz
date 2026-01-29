import { X } from "lucide-react";

const LeaderboardUpdate = () => {
    return (
        <div className="rounded-xl relative w-96 p-8 text-center bg-surface-base border border-surface-stroke flex flex-col gap-2">
            <div className="flex w-full h-4"></div>
            <button className="absolute text-secondary top-4 right-4 p-1 hover:bg-gray-200 cursor-pointer rounded-full"><X size={16}/></button>
            <p className="congratulationsText font-light">Masha Allah! You’re climbing the ranks.</p>
            <h2 className="rankNumber text-3xl text-brand-primary">🏆 <span className="italic"> #24 Rank </span></h2>
            <div className="theme font-bold">"Politics" Theme, This Week</div>
            <p className="font-light text-sm">Keep the momentum going, the community is learning with you.</p>
            <button className="viewLeaderboard px-4 cursor-pointer py-3 rounded-xl text-white bg-button-primary">View Leaderboard</button>
        </div>
    )
}

export default LeaderboardUpdate;