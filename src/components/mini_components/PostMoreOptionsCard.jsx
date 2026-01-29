
const moreOptions = [
    { title: "Save post as Image" },
    { title: "Copy Text" },
    { title: "Hide Note" },
    { title: "Unfollow Topic" },
]


const PostMoreOptionsCard = () => {
    return (
        <div className="absolute top-0 right-10 mt-2 w-40 rounded-xl overflow-hidden bg-surface-base shadow-lg ring-1 ring-surface-stroke ring-opacity-5 z-20">
            <div className="py-1  ">
                {moreOptions.map((option) => (
                    <button className="block px-4 py-2 cursor-pointer  w-full font-medium text-sm text-left text-primary hover:bg-gray-100">
                        {option.title}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default PostMoreOptionsCard
