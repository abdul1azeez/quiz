import { useParams } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useProfileDetails } from "../../../hooks/useProfileDetails";
import { EditProfilePage } from "../../../pages/desktop";
import PublicProfilePage from "../../../pages/desktop/PublicProfilePage";


const UniversalProfile = () => {
    const { handle } = useParams(); 
    const auth = useAuth();
    
   
    const { profile: myProfile, loading: myLoading } = useProfileDetails();

  
    if (auth.isLoading || (auth.isAuthenticated && myLoading)) {
        return <div className="p-10 text-center">Loading Profile...</div>;
    }

    // B. "My" handle from backend must match the URL handle
    const isOwner = auth.isAuthenticated && 
                    myProfile?.handle && 
                    (handle?.toLowerCase() === myProfile.handle.toLowerCase());

    // console.log("Checking Owner:", {
    //     urlHandle: handle,
    //     myHandle: myProfile?.handle,
    //     isOwner: isOwner
    // });

    // 4. Render
    if (isOwner) {
        return <EditProfilePage />;
    } else {
        return <PublicProfilePage />;
    }
};

export default UniversalProfile;