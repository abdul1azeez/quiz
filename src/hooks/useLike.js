import { useState } from "react";
import axios from "axios";

export default function useLike(baseUrl) {
    const [isLiking, setIsLiking] = useState(false);

    const likePost = async (contentId, userId) => {
        try {
            setIsLiking(true);
            const res = await axios.post(
                `${baseUrl}/api/v1/content/${contentId}/like?userId=${userId}`
            );
            return res.data;
        } catch (error) {
            console.error("Error liking post:", error);
            throw error;
        } finally {
            setIsLiking(false);
        }
    };

    return { likePost, isLiking };
}
