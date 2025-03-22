import { ChevronRight, Plus } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { collection, deleteDoc, doc, getDocs, getDoc, onSnapshot, query, setDoc, where } from "firebase/firestore"
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

export function NavWorkspaces({ params }) {
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const unsubscribesRef = useRef([]);

  // Clean up function to unsubscribe from all listeners
  const cleanupListeners = () => {
    unsubscribesRef.current.forEach(unsubscribe => unsubscribe());
    unsubscribesRef.current = [];
  };

  useEffect(() => {
    if (!user?.user?.id) return;

    // Clean up any existing listeners first
    cleanupListeners();

    const fetchData = async () => {
      try {
        // Get workspaces once (not using real-time listener)
        const workspacesQuery = query(
          collection(db, 'workspaces'),
          where('createdBy', '==', user.user.primaryEmailAddress.emailAddress)
        );
        
        // Use getDocs instead of onSnapshot for the initial fetch
        const workspacesSnapshot = await getDocs(workspacesQuery);
        
        const workspacesList = workspacesSnapshot.docs.map(workspaceDoc => {
          const workspaceData = workspaceDoc.data();
          return {
            id: workspaceData.id,
            name: workspaceData.workspaceName,
            emoji: workspaceData.emoji || "📁",
            isActive: params?.workspaceId === workspaceData.id.toString(),
            documents: [] // Will be populated later
          };
        });
        
        // Set workspaces initially with empty documents arrays
        setWorkspaces(workspacesList);
        
        // Now set up a single listener for all documents
        const workspaceIds = workspacesList.map(w => w.id);
        
        if (workspaceIds.length > 0) {
          // For small number of workspaces, 'in' operator works fine
          // For larger numbers, we might need to batch this
          const docsQuery = query(
            collection(db, 'documents'),
            where('workspaceId', 'in', workspaceIds)
          );
          
          const unsubscribeDocs = onSnapshot(docsQuery, (docsSnapshot) => {
            // Create a map of documents by workspace ID
            const docsByWorkspace = {};
            workspaceIds.forEach(id => {
              docsByWorkspace[id] = [];
            });
            
            docsSnapshot.docs.forEach(docSnap => {
              const docData = docSnap.data();
              if (docsByWorkspace[docData.workspaceId]) {
                docsByWorkspace[docData.workspaceId].push({
                  id: docData.id,
                  name: docData.documentName,
                  emoji: docData.emoji || "📄",
                  ...docData
                });
              }
            });
            
            // Update the workspaces with their documents
            setWorkspaces(currentWorkspaces => 
              currentWorkspaces.map(workspace => ({
                ...workspace,
                documents: docsByWorkspace[workspace.id] || []
              }))
            );
          });
          
          unsubscribesRef.current.push(unsubscribeDocs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
    
    // Clean up on unmount or when dependencies change
    return cleanupListeners;
  }, [user?.user?.id, params?.workspaceId]);

  const createNewDocument = async (workspaceId) => {
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
      // Get the document data before deletion
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const docData = docSnap.data();
        
        // Add to trash collection with deletion timestamp
        await setDoc(doc(db, 'trash', documentId), {
          ...docData,
          deletedAt: new Date(),
          originalWorkspaceId: docData.workspaceId
        });
        
        // Delete from documents collection
        await deleteDoc(docRef);

        toast({
          title: "Success",
          description: "Document moved to trash"
        });

        if (params?.documentId === documentId) {
          router.push(`/workspace/${params.workspaceId}`);
        }
      }
    } catch (error) {
      console.error("Error moving document to trash:", error);
      toast({
        title: "Error",
        description: "Failed to move document to trash"
      });
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