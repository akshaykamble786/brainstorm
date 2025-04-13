"use client"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useOrganization, useClerk } from "@clerk/nextjs"
import UseSubscription from "@/hooks/use-subscription"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "../ui/toast"
import { useRouter } from "next/navigation"
import { TemplatesDialog } from "@/components/templates/template-dialog"
import Search from "../../app/(routes)/workspace/_components/Search"

export function NavMain({ items = [] }) {
  const { organization } = useOrganization()
  const { openOrganizationProfile } = useClerk()
  const { hasActiveSubscription } = UseSubscription()
  const { toast } = useToast()
  const router = useRouter()

  const handleInviteMembers = () => {
    if (!organization) return

    const memberCount = organization.membersCount || 0
    if (!hasActiveSubscription && memberCount >= 2) {
      toast({
        title: "Member limit reached",
        description: "Upgrade to Pro to invite more members.",
        variant: "destructive",
        action: (
          <ToastAction altText="Upgrade to Pro" onClick={() => router.push("/pricing")}>
            Upgrade to Pro
          </ToastAction>
        ),
      })
      return
    }

    openOrganizationProfile({
      organization: organization,
      tab: "members",
    })
  }

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          {item.title === "Invite Members" ? (
            <SidebarMenuButton onClick={handleInviteMembers} isActive={item.isActive}>
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          ) : item.title === "Templates" ? (
            <TemplatesDialog
              trigger={
                <SidebarMenuButton isActive={item.isActive}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              }
            />
          ) :  item.title === "Search" ? (
            <Search
              trigger={
                <SidebarMenuButton isActive={item.isActive}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              }
            />
          ) : (
            <SidebarMenuButton
              isActive={item.isActive}
            >
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}