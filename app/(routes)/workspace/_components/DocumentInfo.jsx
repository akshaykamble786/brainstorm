"use client";

import CoverPicker from "@/app/_components/CoverPicker";
import EmojiPickerComponent from "@/app/_components/EmojiPickerComponent";
import { db } from "@/config/FirebaseConfig";
import { toast } from "@/hooks/use-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Clock, SmilePlusIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const DocumentInfo = ({ params }) => {
  const [coverImage, setCoverImage] = useState("/cover.png");
  const [emoji, setEmoji] = useState();
  const [documentInfo, setDocumentInfo] = useState();

  useEffect(() => {
    params && GetDocumentInfo();
  }, [params]);

  const GetDocumentInfo = async () => {
    const docRef = doc(db, "documents", params?.documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setDocumentInfo(docSnap.data());
      setEmoji(docSnap.data()?.emoji);
      docSnap.data()?.coverImage && setCoverImage(docSnap.data()?.coverImage);
    }
  };

  const updateDocumentInfo = async (key, value) => {
    const docRef = doc(db, "documents", params?.documentId);
    await updateDoc(docRef, {
      [key]: value,
    });
    toast({
      variant: "success",
      description: "Document Updated",
    });
  };

  return (
    <div>
      {/* Cover */}
      <CoverPicker
        currentCover={coverImage}
        setNewCover={(cover) => {
          setCoverImage(cover);
          updateDocumentInfo("coverImage", cover);
        }}
      >
        <div className="relative group cursor-pointer">
          <h2
            className="hidden absolute p-4 w-full h-full
                items-center group-hover:flex
                justify-center"
          >
            Change Cover
          </h2>
          <div className="group-hover:opacity-40">
            <Image
              src={coverImage}
              width={400}
              height={400}
              className="w-full h-[200px] object-cover"
              alt="cover image"
            />
          </div>
        </div>
      </CoverPicker>
      {/* Emoji Picker */}
      <div className="absolute ml-10 px-5 mt-[-40px] cursor-pointer">
        <EmojiPickerComponent
          setEmojiIcon={(emoji) => {
            setEmoji(emoji);
            updateDocumentInfo("emoji", emoji);
          }}
        >
          <div className="bg-transparent p-4 rounded-md">
            {emoji ? (
              <span className="text-5xl">{emoji}</span>
            ) : (
              <SmilePlusIcon className="h-10 w-10 text-gray-500" />
            )}
          </div>
        </EmojiPickerComponent>
      </div>
      {/* File Name, Character Count, Version History and Mode Toggle */}
      <div className="flex items-center justify-between mt-5 px-5 ml-10 p-5">
        {/* File Name */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Untitled Document"
            defaultValue={documentInfo?.documentName}
            className="font-bold text-4xl outline-none"
            onBlur={(event) =>
              updateDocumentInfo("documentName", event.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentInfo;
