import React from "react";
import Logo from "./Logo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t mt-6">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2 mb-4 md:mb-0">
          <Logo />
        </Link>
        <div className="flex flex-row space-x-6 text-center">
          <p className="text-xs text-gray-400">
            Built by&nbsp;
            <a
              href="https://www.x.com/awkshhay"
              target="_blank"
              rel="noopener noreferrer"
            >
              <u>Akshay Kamble</u>
            </a>
          </p>
          <p className="text-xs text-gray-400">
            <a
              href="https://www.github.com/akshaykamble786/brainstorm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code available on&nbsp;
              <u>GitHub</u>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
