"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Logo from "./Logo";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/app/(routes)/dashboard/_components/ThemeToggle";

const routes = [
  { title: "Features", href: "/features" },
  { title: "Resources", href: "/resources" },
  { title: "Pricing", href: "/pricing" },
  { title: "About", href: "/about" },
];

const Header = () => {
  const [path, setPath] = useState("");
  const { isSignedIn, } = useAuth();

  return (
    <header className="p-4 flex justify-center items-center">
      <Link href={"/"} className="w-full justify-left items-center gap-2 flex">
        <Logo />
      </Link>

      <NavigationMenu className="hidden md:block">
        <NavigationMenuList className="gap-2">

          <NavigationMenuItem>
            <NavigationMenuTrigger
              onClick={() => setPath("#features")}
              className={cn({
                "dark:text-white": path === "#features",
                "dark:text-white/40": path !== "#features",
                "font-normal": true,
                "text-lg": true,
              })}
            >
              Features
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul
                className="grid
                gap-3
                p-6
                md:w-[400px]
                ld:w-[500px]
                lg:grid-cols-[.75fr_1fr]
                "
              >
                <li className="row-span-3">
                  <span
                    className="flex h-full w-full select-none
                  flex-col
                  justify-end
                  rounded-md
                  bg-gradient-to-b
                  from-muted/50
                  to-muted
                  p-6 no-underline
                  outline-none
                  focus:shadow-md
                  text-black dark:text-white
                  "
                  >
                    Welcome
                  </span>
                </li>
                <ListItem href="/dashboard" title="Introduction">
                  Write, Plan & Organize with our cutting edge AI
                </ListItem>
                <ListItem href="/pricing" title="AI Integration">
                  AI integration to help you ease in.
                </ListItem>
                <ListItem href="/dashboard" title="Diverse Templates">
                  Templates for project, travel, meal, organization...etc.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              onClick={() => setPath("#pricing")}
              className={cn({
                "dark:text-white": path === "#pricing",
                "dark:text-white/40": path !== "#pricing",
                "font-normal": true,
                "text-lg": true,
              })}
            >
              Pricing
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:grid-row-2">
                <ListItem title="Pro Plan" href="/pricing">
                  Unlock full power with collaboration
                </ListItem>
                <ListItem title="Free Plan" href="/dashboard">
                  Great for teams just starting out
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), {
                "dark:text-white": path === "#docs",
                "dark:text-white/40": path !== "#docs",
                "font-normal": true,
                "text-lg": true,
              })}
              href="/pricing"
            >
              About
            </NavigationMenuLink>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>

      <aside className="flex w-full justify-end gap-3">
        {isSignedIn ? (
          <>
            <Link href="/dashboard">
              <Button variant="outline" className="px-3">
                Dashboard
              </Button>
            </Link>
            <UserButton/>
            <ThemeToggle />
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button variant="btn-secondary" className="px-6 hidden sm:block">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="btn-primary" className="whitespace-nowrap">
                Sign up
              </Button>
            </Link>
          </>
        )}
      </aside>
    </header>
  );
};

export default Header;

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "group block select-none space-y-1 font-medium leading-none"
          )}
          {...props}
        >
           <div className="text-black dark:text-white text-sm font-medium leading-none">
            {title}
          </div>
          <p className="group-hover:text-black/70 dark:group-hover:text-white/70 line-clamp-2 text-sm leading-snug text-black/60 dark:text-white/40">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = 'ListItem';