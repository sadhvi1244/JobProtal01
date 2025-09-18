import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-6">
      <div className="container px-6 2xl:px-20 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and copyright */}
          <div className="flex items-center gap-6">
            <img
              src={assets.logo}
              alt="InsiderJobs Logo"
              className="h-8 opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
            <p className="text-gray-500 text-sm text-center md:text-left">
              Created By Sadhvi Kesarwani © 2025 InsiderJobs. All rights
              reserved
            </p>
          </div>

          {/* Social media icons */}
          <div className="flex gap-3">
            <a
              href="#"
              className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-300 group"
            >
              <img
                width={20}
                src={assets.facebook_icon}
                alt="Facebook"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-300 group"
            >
              <img
                width={20}
                src={assets.twitter_icon}
                alt="Twitter"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-300 group"
            >
              <img
                width={20}
                src={assets.instagram_icon}
                alt="Instagram"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
