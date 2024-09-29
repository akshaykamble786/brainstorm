import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex gap-4">
      <Image
        src="/logo.svg" 
        alt="Brainstorm Logo"
        width={25}
        height={25}
      />
      <span className="font-semibold dark:text-washed-purple-600">
        Brainstorm
      </span>
    </div>
  );
};

export default Logo;
