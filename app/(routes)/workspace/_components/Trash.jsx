"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Trash({ trigger }) {
  const [trashItems, setTrashItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  const fetchTrashItems = async () => {
    if (!isLoaded || !user) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, "trash"),
        where("createdBy", "==", user.primaryEmailAddress.emailAddress)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrashItems(items);
    } catch (error) {
      console.error("Error fetching trash items:", error);
      toast({
        title: "Error",
        description: "Failed to load trash items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && isLoaded && user) {
      fetchTrashItems();
    }
  }, [open, isLoaded, user]);

  const restoreDocument = async (docId) => {
    if (!user) return;

    try {
      const docRef = doc(db, "trash", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        const { deletedAt, originalWorkspaceId, ...restData } = docData;

        // Restore to documents collection
        await setDoc(doc(db, "documents", docId), {
          ...restData,
          workspaceId: originalWorkspaceId,
        });

        // Delete from trash
        await deleteDoc(docRef);

        toast({
          title: "Success",
          description: "Document restored successfully",
        });

        // Update the local state instead of refetching
        setTrashItems((prev) => prev.filter((item) => item.id !== docId));
      }
    } catch (error) {
      console.error("Error restoring document:", error);
      toast({
        title: "Error",
        description: "Failed to restore document",
        variant: "destructive",
      });
    }
  };

  const permanentlyDelete = async (docId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "trash", docId));
      toast({
        title: "Success",
        description: "Document permanently deleted",
      });
      // Update the local state instead of refetching
      setTrashItems((prev) => prev.filter((item) => item.id !== docId));
    } catch (error) {
      console.error("Error permanently deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to permanently delete document",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Trash</DialogTitle>
        </DialogHeader>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(85vh - 180px)" }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-muted-foreground">Loading...</span>
            </div>
          ) : trashItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <Trash2 className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No items in trash</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Deleted Date</TableHead>
                  <TableHead>Original Workspace</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trashItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.documentName}
                    </TableCell>
                    <TableCell>
                      {new Date(item.deletedAt?.toDate()).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.originalWorkspaceId}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => restoreDocument(item.id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => permanentlyDelete(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
