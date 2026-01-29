import { Link, NavLink } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Logo_Emblem_Light } from "../../assets";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] px-4 text-center">

      {/* 1. BIG PLACEHOLDER LOGO */}
      {/* TODO: Replace the <div> below with your <img src="/404-illustration.png" /> */}
      <div className="w-64 h-64 rounded-full flex items-center justify-center mb-8 animate-in fade-in zoom-in duration-500 shadow-inner">
        <span className="font-bold text-xl uppercase tracking-widest w-full">
          <NavLink to="/"> <img src={Logo_Emblem_Light} alt="MINE" className="w-full animate-[spin_15s_linear_infinite]" /> </NavLink>
        </span>
      </div>

      {/* 2. ERROR MESSAGE */}
      <h1 className="text-6xl font-black text-primary mb-2 tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold text-[#323E3A] mb-4">Page Not Found</h2>

      <p className="text-tertiary max-w-md mx-auto mb-8 leading-relaxed">
        Oops! The page you are looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      {/* 3. ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Primary Action: Go Home */}
        <Link to="/">
          <button className="flex items-center justify-center gap-2 px-8 py-3 bg-[#04644C] text-white rounded-full font-bold shadow-md hover:bg-[#03523F] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto">
            <Home size={18} />
            Back to Home
          </button>
        </Link>

        {/* Secondary Action: Go Back History */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#5C6261] border border-gray-200 rounded-full font-bold hover:bg-gray-50 hover:text-[#323E3A] transition-all duration-300 w-full sm:w-auto"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>

    </div>
  );
};

export default NotFound;