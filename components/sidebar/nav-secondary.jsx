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
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Progress } from "@/components/ui/progress";
// import { collection, onSnapshot, query, where } from "firebase/firestore";
// import { db } from "@/config/FirebaseConfig";
// import { Button } from "../ui/button";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";


export function NavSecondary({ items, ...props }) {
  // const [workspaceCount, setWorkspaceCount] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date())

  // const { user } = useUser();

  // useEffect(() => {
  //   if (user?.primaryEmailAddress?.emailAddress) {
  //     const getWorkspaceCount = () => {
  //       const q = query(
  //         collection(db, "workspaces"),
  //         where("createdBy", "==", user.primaryEmailAddress.emailAddress)
  //       );

  //       const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //         setWorkspaceCount(querySnapshot.size);
  //       });

  //       return unsubscribe;
  //     };

  //     const unsubscribe = getWorkspaceCount();
  //     return () => unsubscribe();
  //   }
  // }, [user]);

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