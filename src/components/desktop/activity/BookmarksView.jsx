import { ArticleCard, EmptyState } from "./ActivityHelpers";

const BookmarksView = ({ data }) => {
  if (!data || data.length === 0) return <EmptyState label="bookmarks" />;
  
  return (
    <div className="flex flex-col gap-2">
      {data.map((item, idx) => (
        <ArticleCard key={item.id} item={item} index={idx} />
      ))}
    </div>
  );
};

export default BookmarksView;