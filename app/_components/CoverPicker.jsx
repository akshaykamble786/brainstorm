"use client";

import React, { useEffect, useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoverOption from "./CoverOption";
import Image from "next/image";
import { Loader2Icon, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, setDoc, increment, Timestamp } from "firebase/firestore";
import UseSubscription from "@/hooks/use-subscription";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const CoverPicker = ({ children, currentCover, setNewCover }) => {
  const { hasActiveSubscription } = UseSubscription();
  const [userImageCount, setUserImageCount] = useState(0);
  const [selectedCover, setSelectedCover] = useState(currentCover);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { edgestore } = useEdgeStore();
  const { toast } = useToast();
  const { userId } = useAuth();
  const router = useRouter();

  const getUserImageCount = async () => {
    if (!userId) return;

    try {
      const userMediaRef = doc(db, "media", userId);
      const docSnap = await getDoc(userMediaRef);

      if (docSnap.exists()) {
        setUserImageCount(docSnap.data().imageCount || 0);
      } else {
        setUserImageCount(0);
      }
    } catch (error) {
      console.error("Error fetching image count:", error);
    }
  };

  useEffect(() => {
    getUserImageCount();
  }, [userId, uploadedImage]);

  const trackUploadInFirebase = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const userMediaRef = doc(db, "media", userId);

      const docSnap = await getDoc(userMediaRef);

      if (docSnap.exists()) {
        await setDoc(
          userMediaRef,
          {
            imageCount: increment(1),
            lastUploadedAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          },
          { merge: true }
        );
      } else {
        await setDoc(userMediaRef, {
          userId,
          imageCount: 1,
          createdAt: Timestamp.now(),
          lastUploadedAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }

      console.log("Upload tracked in Firebase");
    } catch (error) {
      console.error("Error tracking upload in Firebase:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await getUserImageCount();

    if (!hasActiveSubscription && userImageCount >= 3) {
      toast({
        title: "Upload limit reached",
        description: "You've reached the maximum number of upload limit for the free plan",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Upgrade to Pro"
            onClick={() => router.push("/pricing")}
          >
            Upgrade to Pro
          </ToastAction>
        ),
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      const uploadOptions = {
        file,
        options: {
          temporary: false,
        },
      };

      if (
        uploadedImage &&
        !CoverOption.some((cover) => cover.imageUrl === uploadedImage)
      ) {
        uploadOptions.options.replaceTargetUrl = uploadedImage;
      }

      const res = await edgestore.publicFiles.upload(uploadOptions);

      if (res.url) {
        setUploadedImage(res.url);
        setSelectedCover(res.url);

        await trackUploadInFirebase();

        await getUserImageCount();

        toast({
          title: "Upload successful",
          variant: "success",
          description: "Your cover image has been uploaded",
        });
      } else {
        throw new Error("No URL in response");
      }
    } catch (error) {
      console.error("Detailed upload error:", error);

      let errorMessage = "There was an error uploading your image";

      if (error.message?.includes("unauthorized")) {
        errorMessage =
          "Upload authorization failed. Please check your EdgeStore configuration.";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error occurred. Please check your connection.";
      }

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDialogOpen = () => {
    setSelectedCover(currentCover);
    setUploadedImage(
      currentCover &&
        !CoverOption.some((cover) => cover.imageUrl === currentCover)
        ? currentCover
        : null
    );
  };

  const handleUpdate = () => {
    if (selectedCover && selectedCover !== currentCover) {
      setNewCover(selectedCover);
    }
  };

  return (
    <Dialog onOpenChange={(open) => open && handleDialogOpen()}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Cover</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={
            currentCover &&
            !CoverOption.some((cover) => cover.imageUrl === currentCover)
              ? "upload"
              : "preset"
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Preset Covers</TabsTrigger>
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
          </TabsList>

          <TabsContent value="preset">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3">
              {CoverOption.map((cover, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCover(cover?.imageUrl);
                    setUploadedImage(null);
                  }}
                  className={`${
                    selectedCover === cover?.imageUrl
                      ? "border-primary border-2"
                      : ""
                  } p-1 rounded-md cursor-pointer hover:opacity-80 transition`}
                >
                  <Image
                    className="h-[70px] w-full rounded-md object-cover"
                    src={cover?.imageUrl}
                    width={200}
                    height={140}
                    alt="cover-image"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative w-full h-[200px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                  {uploadedImage ? (
                    <>
                      <Image
                        src={uploadedImage}
                        alt="Uploaded cover"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <label className="cursor-pointer">
                          <span className="sr-only">Choose file</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                          />
                          <Button
                            variant="secondary"
                            disabled={isUploading}
                            onClick={() =>
                              document
                                .querySelector('input[type="file"]')
                                .click()
                            }
                          >
                            Change Image
                          </Button>
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
                {isUploading && <Loader2Icon className="animate-spin size-4" />}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="text-sm"
              type="button"
              onClick={handleUpdate}
              disabled={isUploading}
            >
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoverPicker;