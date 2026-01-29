import React from "react";
import { ArticleCard, EmptyState } from "./ActivityHelpers";

const LikesView = ({ data }) => {
  if (!data || data.length === 0) return <EmptyState label="liked posts" />;
  
  return (
    <div className="flex flex-col gap-2">
      {data.map((item, idx) => (
        <ArticleCard key={item.id} item={item} index={idx} />
      ))}
    </div>
  );
};

export default LikesView;