import React from "react";
import { Bell, ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Notifications = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">

      {/* 1. ANIMATED ICON CONTAINER */}
      <div className="relative mb-8 group cursor-default">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-[#04644C]/20 rounded-full blur-2xl transform group-hover:scale-110 transition-transform duration-700"></div>

        <div className="relative bg-white p-8 rounded-full shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-500">
          <Bell
            size={64}
            className="text-[#04644C] group-hover:rotate-12 transition-transform duration-300"
            strokeWidth={1.5}
          />
          {/* "New Notification" Dot Graphic */}
          <div className="absolute top-0 right-0 bg-[#FFF0D6] p-2 rounded-full border-2 border-white shadow-sm">
            <Zap size={20} className="text-[#056B71] fill-current" />
          </div>
        </div>
      </div>

      {/* 2. COMING SOON BADGE */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0D6] text-[#056B71] text-xs font-bold uppercase tracking-widest shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#056B71] animate-pulse"></span>
        Coming Soon
      </div>

      {/* 3. HEADLINES */}
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
        Stay in the <span className="text-[#04644C]">Loop</span>
      </h1>

      <p className="text-tertiary text-lg max-w-md mx-auto mb-10 leading-relaxed">
        One Place for all important alerts — <br/> currently under construction.
      </p>

      {/* 4. CALL TO ACTION */}
      <Link to="/">
        <button className="group flex items-center gap-2 px-8 py-3 bg-button-primary text-white rounded-xl font-medium transition-all hover:bg-[#323E3A] hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </Link>

    </div>
  );
};

export default Notifications;