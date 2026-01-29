import { X } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { Logo_Emblem_Light, FullLogo_Light } from "../../../assets";

const SignInModal = ({ isOpen, onClose }) => {
  const auth = useAuth();

  if (!isOpen) return null;

  const handleSignIn = () => {
    auth.signinRedirect();
  };

  return (
    <>
      {/* Overlay - Full screen dimmed background */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4 transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-800">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <img src= {Logo_Emblem_Light} alt="Logo" />
            <h2 className="text-xl font-bold text-white">Sign in to MINE</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Heading */}
            <div className="text-center space-y-2">
              
              <p className="text-gray-400 text-sm">
                you must be signed in to continue
              </p>
            </div>

            {/* Email Input */}
            {/*<div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition"
              />
            </div>*/}

            {/* Sign in Button */}
            <button
              onClick={handleSignIn}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3 rounded-lg transition-all duration-200"
            >
              Sign in
            </button>

            {/* Divider */}
            {/*
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">or</span>
              </div>
            </div>
            */}

            {/* Sign in with Password 
            <button className="w-full px-4 py-3 border border-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-800 transition">
              Sign in with password
            </button>
              */}

            {/* Footer 
            <p className="text-center text-sm text-gray-500">
              First time here?{" "}
              <button className="text-brand-primary hover:underline font-medium">
                Create account
              </button>
            </p>
                */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInModal;
