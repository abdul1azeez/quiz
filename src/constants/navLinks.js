import {
    HomeIcon_Active,
    HomeIcon_NotActive,
    CompassIcon_Active,
    CompassIcon_NotActive,
    NotificationIcon_Active,
    NotificationIcon_NotActive,
    LibraryIcon_Active,
    LibraryIcon_NotActive,
    UserIcon_Active,
    UserIcon_NotActive,
} from "../assets";

import { UserPen } from "lucide-react";

export const navLinks = [
    {
        to: "/",
        iconActive: HomeIcon_Active,
        iconNotActive: HomeIcon_NotActive,
        alt: "Home"
    },
    {
        to: "/myActivity",
        iconActive: LibraryIcon_Active,
        iconNotActive: LibraryIcon_NotActive,
        alt: "Activity"
    },
    {
        to: "/explore",
        iconActive: CompassIcon_Active,
        iconNotActive: CompassIcon_NotActive,
        alt: "Explore"
    },
    {
        to: "/mine-creators",
        iconActive: UserIcon_Active,
        iconNotActive: UserIcon_NotActive,
        alt: "Creators"
    },
    {
        to: "/notifications",
        iconActive: NotificationIcon_Active,
        iconNotActive: NotificationIcon_NotActive,
        alt: "Notifications"
    },
]
