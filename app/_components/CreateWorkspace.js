"use client";

import CoverPicker from '@/app/_components/CoverPicker';
import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ToastAction } from '@/components/ui/toast';
import { db } from '@/config/FirebaseConfig';
import { toast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@clerk/nextjs';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Loader2Icon, SmilePlus, Lock, Globe } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CreateWorkspace = () => {
  const [coverImage, setCoverImage] = useState('/cover.png');
  const [workspaceName, setWorkspaceName] = useState("");
  const [emoji, setEmoji] = useState();
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true); 

  const { user } = useUser();
  const { orgId } = useAuth();
  const router = useRouter();

  // const checkWorkspaceCount = async () => {
  //   const workspacesRef = collection(db, 'workspaces');
  //   const userIdentifier = orgId ? orgId : user?.primaryEmailAddress?.emailAddress;
    
  //   const q = query(
  //     workspacesRef, 
  //     where('orgId', '==', userIdentifier)
  //   );

  //   const querySnapshot = await getDocs(q);
  //   return querySnapshot.size;
  // };

  const OnCreateWorkspace = async () => {
    try {
      setLoading(true);
      
      // const workspaceCount = await checkWorkspaceCount();
      
      // if (workspaceCount >= process.env.NEXT_PUBLIC_MAX_WORKSPACE_COUNT) {
      //   toast({
      //     title: "Workspace Limit Reached",
      //     description: "You've reached the maximum number of workspaces for the free plan.",
      //     variant: "default",
      //     action: (
      //       <ToastAction altText="Upgrade to Pro" onClick={() => router.push('/pricing')}>
      //         Upgrade to Pro
      //       </ToastAction>
      //     ),
      //   });
      //   setLoading(false);
      //   return;
      // }

      const workspaceId = Date.now();
      await setDoc(doc(db, 'workspaces', workspaceId.toString()), {
        workspaceName: workspaceName,
        emoji: emoji,
        coverImage: coverImage,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        id: workspaceId,
        orgId: orgId ? orgId : user?.primaryEmailAddress?.emailAddress,
        isPublic: !isPrivate,
        collaborators: [user?.primaryEmailAddress?.emailAddress],
      });

      const docId = crypto.randomUUID();
      await setDoc(doc(db, 'documents', docId.toString()), {
        workspaceId: workspaceId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        coverImage: null,
        emoji: "📄",
        id: docId,
        documentName: "Untitled Document",
      });

      router.replace("/workspace/" + workspaceId + "/" + docId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workspace. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-10 md:px-36 lg:px-52 xl:px-80 py-14'>
      <div className='shadow-2xl rounded-xl dark:border border-gray-800'>
        {/* Cover image section */}
        <CoverPicker currentCover={coverImage} setNewCover={(v) => setCoverImage(v)}>
          <div className='relative group cursor-pointer'>
            {/* Hover overlay text */}
            <h2 className='hidden absolute p-4 w-full h-full items-center justify-center group-hover:flex'>
              Change Cover
            </h2>
            <div className='group-hover:opacity-40'>
              <Image 
                src={coverImage} 
                width={400} 
                height={400} 
                className='w-full h-[180px] object-cover rounded-t-xl' 
                alt='cover image' 
              />
            </div>
          </div>
        </CoverPicker>

        <div className='p-12'>
          <h2 className='font-normal text-xl'>Create a new workspace</h2>
          <h2 className='font-normal text-sm mt-2'>
            This is a shared space where you can collaborate with your colleagues and friends. 
            You can always rename it later
          </h2>

          <div className='mt-6 flex gap-2 items-center'>
            {/* Emoji picker */}
            <EmojiPickerComponent setEmojiIcon={(v) => setEmoji(v)}>
              <Button variant="outline">
                {emoji ? emoji : <SmilePlus />}
              </Button>
            </EmojiPickerComponent>
            <Input 
              placeholder="Workspace name" 
              onChange={(e) => { setWorkspaceName(e.target.value) }} 
            />
          </div>

          <div className='mt-6 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              <span className='text-sm'>
                {isPrivate ? 'Private workspace' : 'Public workspace'}
              </span>
            </div>
            <Switch
              checked={!isPrivate}
              onCheckedChange={(checked) => setIsPrivate(!checked)}
            />
          </div>
          
          <p className='text-sm text-gray-500 mt-2'>
            {isPrivate 
              ? 'Only you can access this workspace. No one else can view or collaborate.'
              : 'Anyone with the link can view and comment. You can invite specific people to collaborate.'}
          </p>

          <div className="mt-7 flex justify-end gap-6">
            <Button 
              disabled={!workspaceName?.length || loading} 
              className="text-sm" 
              onClick={OnCreateWorkspace}
            >
              Create {loading && <Loader2Icon className='animate-spin ml-2' />}
            </Button>
            <Button variant="outline" className="text-sm">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;