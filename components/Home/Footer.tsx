import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto text-center px-4">
        <div className="flex justify-center items-center mb-4">
          <img
            src="/logo-color.png"
            alt="Giggo Logo"
            className="h-10 w-auto mr-2"
          />
        </div>
        <p className="text-lg font-light mb-2">
          Giggo is your go-to platform for connecting unskilled workers with
          temporary local gigs.
        </p>
        <p className="text-sm text-gray-400">
          Whether you're looking for short-term help or flexible work, Giggo
          makes it easy to find the right fit.
        </p>
        <p className="text-xs text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} Giggo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
