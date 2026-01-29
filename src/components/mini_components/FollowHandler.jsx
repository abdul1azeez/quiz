import React, { useEffect, useState } from 'react'
import FollowButton from '../desktop/postSection/postInteractions/FollowButton'
import { useAuth } from 'react-oidc-context';
import { useParams } from 'react-router';
import { useProfileDetails } from '../../hooks/useProfileDetails';

const FollowHandler = () => {

    const { handle } = useParams();
    const auth = useAuth();
    // const [profile, setProfile] = useState(null);
    const { profile } = useProfileDetails();


    // ---------------- FETCH Follow ----------------
    const [followCount, setFollowCount] = useState(0);
    const handleFollowChange = (delta) => {
        setFollowCount((prev) => Math.max(0, prev + delta));
    };


    useEffect(() => {
        const fetchFollowCount = async () => {
            try {
                const res = await fetch(`${PROFILE_BASE_URL}/follow/users/${profile?.userId}/followers/count`,
                    { headers: { Authorization: `Bearer ${auth.user?.id_token}` } }
                );
                if (!res.ok) throw new Error("Failed to fetch follow count");
                const data = await res.json();
                setFollowCount(data);
            } catch (err) {
                console.error("Error fetching follow count:", err);
            }
        };
        if (profile?.userId) fetchFollowCount();
    }, [profile?.userId]);

    return (
        <div>
            {/* Follower Count */}
            <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-gray-900">
                    {followCount}
                </span>
                <span className="text-sm text-gray-500">
                    Followers
                </span>
            </div>


            <p className="text-sm text-gray-500">
                <span className="font-semibold">
                    <FollowButton
                        targetUserId={profile.userId}
                        onFollowChange={handleFollowChange}
                    />
                </span>
            </p>

        </div>
    )
}

export default FollowHandler
