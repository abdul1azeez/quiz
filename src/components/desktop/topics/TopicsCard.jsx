import topics from './topics';
import { Plus } from 'lucide-react';

const TopicsCard = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="textHeading">
                <h2 className='text-xl font-bold'>Expand Your Horizons</h2>
                <p className='font-medium'>Follow more topics to enrich your Knowledge</p>
            </div>
            <div className='topicCards flex gap-4 overflow-x-scroll pb-2'>
                {topics.map((topic) => (
                    <div
                        key={topic.id}
                        className="topicCard bg-gray-300 relative  p-3 rounded-xl text-xs font-semibold cursor-pointer w-44 h-56 hover:underline flex-shrink-0 
                 flex flex-col justify-between"
                        style={{
                            backgroundImage: `url(${topic.thumbnail})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="flex justify-end z-10">
                            {!topic.added && (
                                <button className="addButton p-2 bg-overlay-background backdrop-blur-xs border border-white/40 rounded-xl">
                                    <Plus className='text-surface-base' />
                                </button>
                            )}
                        </div>

                        <div className="text z-10 text-surface-base">
                            <p className="title font-cardo text-xl">{topic.topicName}</p>
                        </div>
                        <div className="absolute rounded-xl inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default TopicsCard
