import { Link } from "react-router";
import { EmptyState } from "./ActivityHelpers";
import { ProfileAvatar } from "../profileSection/ProfileVisuals";
import FollowButton from "../postSection/postInteractions/FollowButton";

const SubscriptionsView = ({ data }) => {
  if (!data || data.length === 0) return <EmptyState label="subscriptions" />;

  return (
    <div className="p-4 flex flex-col gap-3">
      {data.map((user, idx) => (
        <Link to={`/profile/${user.handle}`} key={user.id}>
          <div
            className="flex w-full items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-[#04644C]/20 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer group animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <ProfileAvatar picture={user.avatar} size="sm" />
              <div className="min-w-0">
                <h4 className="font-bold text-[#000A07] truncate group-hover:text-[#04644C] transition-colors">
                  {user.name}
                </h4>
                <p className="text-xs text-[#5C6261] truncate">
                  @{user.handle}
                </p>
              </div>
            </div>
            {/* <button className="text-xs font-bold text-[#04644C] bg-white border border-[#04644C]/20 px-4 py-1.5 rounded-full hover:bg-[#04644C] hover:text-white transition-all shadow-sm">
              Following
            </button> */}
            <FollowButton />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SubscriptionsView;
