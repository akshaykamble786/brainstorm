// nav-main.jsx
"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { useOrganization, useClerk } from "@clerk/nextjs";

export function NavMain({ items }) {
  const { organization } = useOrganization();
  const { openOrganizationProfile } = useClerk();

  const handleInviteMembers = () => {
    if (organization) {
      openOrganizationProfile({
        organization: organization,
        tab: "members"
      });
    }
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          {item.title === "Invite Members" ? (
            <SidebarMenuButton 
              onClick={handleInviteMembers}
              isActive={item.isActive}
            >
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton asChild isActive={item.isActive}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}