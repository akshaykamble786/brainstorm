import { ChevronRight, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from "firebase/firestore"
import { db } from "@/config/FirebaseConfig"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import DocumentOptions from "../../app/(routes)/workspace/_components/DocumentOptions"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
// import { ToastAction } from "../ui/toast"

export function NavWorkspaces({ params }) {
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useUser()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user?.user?.id) {
      const workspacesQuery = query(
        collection(db, 'workspaces'),
        where('createdBy', '==', user.user.primaryEmailAddress.emailAddress)
      )

      const unsubscribeWorkspaces = onSnapshot(workspacesQuery, async (snapshot) => {
        const workspacePromises = snapshot.docs.map(async (workspaceDoc) => {
          const workspaceData = workspaceDoc.data()

          const docsQuery = query(
            collection(db, 'documents'),
            where('workspaceId', '==', workspaceData.id)
          )

          const docsSnapshot = await new Promise((resolve) => {
            onSnapshot(docsQuery, (docs) => {
              resolve(docs)
            })
          })

          const documents = docsSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().documentName,
            emoji: doc.data().emoji || "📄",
            ...doc.data(),
          }))

          return {
            id: workspaceData.id,
            name: workspaceData.workspaceName,
            emoji: workspaceData.emoji || "📁",
            isActive: params?.workspaceId === workspaceData.id.toString(),
            documents
          }
        })

        const populatedWorkspaces = await Promise.all(workspacePromises)
        setWorkspaces(populatedWorkspaces)
      })

      return () => unsubscribeWorkspaces()
    }
  }, [user, params])

  const createNewDocument = async (workspaceId) => {
    // const workspace = workspaces.find(w => w.id === workspaceId)
    // if (workspace?.documents?.length >= process.env.NEXT_PUBLIC_MAX_FILE_COUNT) {
    //   toast({
    //     title: "Document Limit Reached",
    //     description: "You've reached the maximum number of documents for the free plan.",
    //     variant: "default",
    //     action: (
    //       <ToastAction altText="Upgrade to Pro" onClick={() => router.push('/pricing')}>
    //         Upgrade to Pro
    //       </ToastAction>
    //     ),
    //   });
    //   return
    // }

    setLoading(true)
    try {
      const docId = crypto.randomUUID()
      await setDoc(doc(db, 'documents', docId), {
        workspaceId,
        createdBy: user.user.primaryEmailAddress.emailAddress,
        createdAt: new Date(),
        coverImage: null,
        emoji: "📄",
        id: docId,
        documentName: "Untitled Document",
      })

      router.push(`/workspace/${workspaceId}/${docId}`)
    } catch (error) {
      console.error("Error creating document:", error)
      toast({
        title: "Error",
        description: "Failed to create new document"
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteDocument = async (documentId) => {
    try {
      await deleteDoc(doc(db, 'documents', documentId))

      toast({
        title: "Success",
        description: "Document moved to trash"
      })

      if (params?.documentId === documentId) {
        router.push(`/workspace/${params.workspaceId}`)
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document"
      })
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarMenuAction
        disabled={loading}
      >
        <Link href="/createworkspace">
          <Plus className="size-4" />
        </Link>
      </SidebarMenuAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces.map((workspace) => (
            <Collapsible
              key={workspace.id}
              defaultOpen={workspace.isActive}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={workspace.isActive ? "bg-accent" : ""}
                >
                  <Link href={`/workspace/${workspace.id}`}>
                    <span>{workspace.emoji}</span>
                    <span>{workspace.name}</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction
                    className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                    showOnHover
                  >
                    <ChevronRight />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <SidebarMenuAction
                  showOnHover
                  onClick={() => createNewDocument(workspace.id)}
                  disabled={loading}
                >
                  <Plus />
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {workspace.documents.map((doc) => (
                      <SidebarMenuSubItem
                        key={doc.id}
                        className="group flex items-center justify-between pr-2"
                      >
                        <SidebarMenuSubButton
                          asChild
                          className={`flex-1 ${params?.documentId === doc.id ? "bg-accent" : ""}`}
                        >
                          <Link href={`/workspace/${workspace.id}/${doc.id}`}>
                            <span>{doc.emoji}</span>
                            <span>{doc.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <DocumentOptions
                            doc={doc}
                            deleteDocument={deleteDocument}
                            workspaceId={workspace.id}
                          />
                        </div>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}