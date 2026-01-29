
const topics= [
    {id:1, name: "Home"},
    {id:2, name: "Popular"},
    {id:3, name: "Trending"},
]


const TopicTabs = () => {
  return (
    <div className="">
        <div className="tabs flex gap-4">
            {topics.map((topic) => (
                <div key={topic.id} className="tab bg-gray-300 p-2 rounded-xl text-xs font-semibold cursor-pointer hover:underline">
                    {topic.name}
                </div>
            ))}
        </div>
    </div>
  )
}

export default TopicTabs
