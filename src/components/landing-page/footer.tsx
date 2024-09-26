import React from "react";
import Logo from "../logo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t mt-6">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2 mb-4 md:mb-0">
          <Logo />
        </Link>
        <div className="flex flex-col md:flex-row md:space-x-6 text-center md:text-left space-y-2 md:space-y-0">
          <p className="text-xs text-gray-400">
            © 2024 Brainstorm. All rights reserved
          </p>
          <p className="text-xs text-gray-400">Terms of Service</p>
          <p className="text-xs text-gray-400">Privacy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
