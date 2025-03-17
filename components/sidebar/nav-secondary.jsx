import React, { useState } from "react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Calendar } from "@/components/ui/calendar";

export function NavSecondary({ items, ...props }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date())

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.title === "Calendar" ? (
                <>
                  <SidebarMenuButton onClick={handleCalendarClick}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {showCalendar && (
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border bg-background text-foreground"
                    />
                  )}
                </>
              ) : (
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}

              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}