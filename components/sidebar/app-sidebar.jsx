"use client"

import * as React from "react"
import {
  Blocks,
  Search,
  Trash2,
  Calendar,
  Users2Icon,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavWorkspaces } from "./nav-workspaces"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Navfooter from "./nav-footer"
import OrgSwitcher from "./org-switcher"
import { NavFavorites } from "./nav-favorites"

const data = {
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Invite Members",
      url: "",
      icon: Users2Icon,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
  ],
}

export function AppSidebar({ params
}) {

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <OrgSwitcher />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavWorkspaces params={params}/>
        <NavFavorites />
        <NavSecondary items={data.navSecondary} className="mt-auto" params={params} />
      </SidebarContent>
      <Navfooter />
      <SidebarRail />
    </Sidebar >
  )
}