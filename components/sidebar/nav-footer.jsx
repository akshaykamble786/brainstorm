"use client";

import * as React from "react"
import {
    BadgeCheck,
    ChevronsUpDown,
    CreditCard,
    DollarSign,
    LogOut,
    Sparkles,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import UseSubscription from "@/hooks/use-subscription";

export default function Navfooter() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { hasActiveSubscription } = UseSubscription();
    const router = useRouter();
    const clerk = useClerk();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="py-8 px-4 data-[state=open]:bg-background data-[state=open]:text-foreground"
                        >
                            <UserButton />
                            <div className="flex-col gap-4">
                                <h2 className="text-sm dark:opacity-50">{ hasActiveSubscription ? "Pro Plan" : "Free Plan" }</h2>
                                <h2 className="text-xs">{user?.fullName}</h2>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <UserButton />
                                <div className="flex-col gap-4">
                                    <h2 className="text-sm dark:opacity-50">{ hasActiveSubscription ? "Pro Plan" : "Free Plan" }</h2>
                                    <h2 className="text-xs">{user?.fullName}</h2>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {!hasActiveSubscription && <DropdownMenuItem onClick={() => router.push('/pricing')}>
                                <Sparkles className="mr-1.5 size-4" />
                                Upgrade to Pro
                            </DropdownMenuItem>}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => {
                                clerk.openUserProfile();
                            }}>
                                <BadgeCheck className="mr-1.5 size-5" />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/pricing')}>
                                <DollarSign className="mr-1.5 size-5" />
                                Pricing
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => {
                            signOut();
                        }}>
                            <LogOut className="mr-1.5 size-5" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu >
    )
}