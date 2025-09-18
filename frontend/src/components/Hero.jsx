import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="2xl:px-20 mx-auto my-10 px-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white py-16 text-center rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-soft-light"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-soft-light"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Discover Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Dream Career
            </span>{" "}
            Opportunity
          </h2>
          <p className="mb-8 max-w-2xl mx-auto text-lg font-light px-5">
            Explore over{" "}
            <span className="font-semibold text-yellow-300">20,000+</span>{" "}
            curated job openings. Your next career breakthrough starts here.
          </p>

          {/* Enhanced Search UI */}
          <div className="bg-white text-gray-600 max-w-3xl mx-auto rounded-xl shadow-2xl p-1 flex flex-col md:flex-row items-stretch">
            <div className="flex-1 flex items-center p-3 border-b md:border-b-0 md:border-r border-gray-100">
              <img
                className="h-5 w-5 mr-2 text-blue-500"
                src={assets.search_icon}
                alt="Search"
              />
              <input
                type="text"
                placeholder="Job title, skills, or company"
                ref={titleRef}
                onKeyPress={handleKeyPress}
                className="flex-1 p-1 outline-none placeholder-gray-400 text-gray-700"
              />
            </div>
            <div className="flex-1 flex items-center p-3 border-b md:border-b-0 md:border-r border-gray-100">
              <img
                className="h-5 w-5 mr-2 text-blue-500"
                src={assets.location_icon}
                alt="Location"
              />
              <input
                type="text"
                placeholder="Location or remote"
                ref={locationRef}
                onKeyPress={handleKeyPress}
                className="flex-1 p-1 outline-none placeholder-gray-400 text-gray-700"
              />
            </div>
            <button
              onClick={onSearch}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 py-3 px-8 rounded-xl text-white font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Search Jobs
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-300">
            Try: "Frontend Developer", "Remote", "Project Manager"
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="bg-white shadow-lg mx-auto mt-8 p-6 rounded-2xl flex flex-col items-center">
        <p className="font-medium text-gray-500 mb-6 text-sm uppercase tracking-wider">
          Trusted by leading companies worldwide
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 place-items-center w-full">
          {[
            assets.microsoft_logo,
            assets.walmart_logo,
            assets.samsung_logo,
            assets.adobe_logo,
            assets.amazon_logo,
            assets.accenture_logo,
          ].map((logo, index) => (
            <div
              key={index}
              className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 grayscale hover:grayscale-0 opacity-80 hover:opacity-100"
            >
              <img
                className="h-6 object-contain"
                src={logo}
                alt="Company logo"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
