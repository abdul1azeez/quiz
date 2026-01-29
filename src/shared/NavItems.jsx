import { NavLink } from "react-router-dom";

const NavItems = ({ link, orientation = "vertical" }) => {
    const isVertical = orientation === "vertical";

    return (
        <NavLink to={link.to} className={({ isActive }) => `
                                            font-medium px-4 py-3 rounded-xl transition flex items-center gap-3
                                            ${isActive
                                                ? "bg-[#04644C]/10 text-black font-bold border border-[#04644C]/20"
                                                : "text-gray-600 hover:bg-gray-50"
                                            }
                                        `}>
            {({ isActive }) => (
                <div
                    className={`flex items-center ${isVertical ? "gap-2 justify-start" : "flex-col justify-center gap-1"
                        }`}
                >
                    <img
                        src={isActive ? link.iconActive : link.iconNotActive}
                        alt={link.alt}
                        className="w-7 h-7"
                    />

                    <span
                        className={`${isActive ? "font-bold text-link" : "font-normal text-secondary"} 
                        ${isVertical ? "block" : "hidden"} text-lg`}
                    >
                        {link.alt}
                    </span>


                </div>
            )
            }
        </NavLink >
    );
};

export default NavItems;
