import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm py-3">
      <div className="px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo with hover effect */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img
            src={assets.logo}
            className="h-8 transition-transform duration-300 group-hover:scale-105"
            alt="Company Logo"
          />
          <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            JobConnect
          </span>
        </div>

        {user ? (
          <div className="flex items-center gap-5">
            <Link
              to={"/applications"}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium relative group"
            >
              Applied Jobs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <span className="hidden lg:block text-gray-300">|</span>

            <div className="flex items-center gap-3">
              <p className="hidden lg:block text-gray-700">
                Welcome, <span className="font-medium">{user.firstName}</span>
              </p>
              <div className="border-l border-gray-200 pl-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <button
              onClick={(e) => setShowRecruiterLogin(true)}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              For Employers
            </button>

            <button
              onClick={(e) => openSignIn()}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2.5 rounded-full font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
