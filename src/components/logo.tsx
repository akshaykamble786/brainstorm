import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <>
      <Image
        src="/logo.svg" 
        alt="Brainstorm Logo"
        width={25}
        height={25}
      />
      <span className="ml-2 font-semibold dark:text-washed-purple-600">
        Brainstorm
      </span>
    </>
  );
};

export default Logo;
