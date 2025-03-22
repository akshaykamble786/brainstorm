"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

const Search = ({ trigger }) => {
  const [open, setOpen] = useState(false)
  const [documents, setDocuments] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const router = useRouter()
  const { userId } = useAuth()

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!userId) return

      try {
        const q = query(
          collection(db, 'documents')
        )
        const querySnapshot = await getDocs(q)
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          workspaceId: doc.data().workspaceId,
          name: doc.data().documentName,
          emoji: doc.data().emoji || "📄"
        }))
        setDocuments(docs)
      } catch (error) {
        console.error("Error fetching documents:", error)
      }
    }

    fetchDocuments()
  }, [userId])

  const filterDocuments = (query) => {
    if (!query) {
      setSearchResults(documents)
      return
    }

    const filtered = documents.filter(doc => 
      doc.name.toLowerCase().includes(query.toLowerCase())
    )
    setSearchResults(filtered)
  }

  const onSelect = (doc) => {
    router.push(`/workspace/${doc.workspaceId}/${doc.id}`)
    setOpen(false)
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          <span>Search documents...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            ⌘K
          </kbd>
        </button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search all documents..." 
            onValueChange={filterDocuments}
          />
          <CommandList>
            <CommandEmpty>No documents found.</CommandEmpty>
            <CommandGroup heading="Documents">
              {searchResults.map((doc) => (
                <CommandItem
                  key={doc.id}
                  value={doc.name}
                  onSelect={() => onSelect(doc)}
                >
                  <span className="mr-2">{doc.emoji}</span>
                  <span>{doc.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default Search