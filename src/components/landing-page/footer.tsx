import React from "react";
import Logo from "../logo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t mt-6">
      <Link href={"/"} className="w-full justify-left items-center gap-2 flex">
        <Logo />
        <div className="container max-w-7xl flex space-x-6 justify-end">
          <p className="text-xs text-gray-400">
            © 2024 Brainstorm . All rights reserved
          </p>
          <p className="text-xs text-gray-400">Terms of Service</p>
          <p className="text-xs text-gray-400">Privacy</p>
        </div>
      </Link>
    </footer>
  );
};

export default Footer;