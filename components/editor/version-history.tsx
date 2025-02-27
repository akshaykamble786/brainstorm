import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useMemo, useState } from "react";
import { Editor } from "@tiptap/react";
import {
  HistoryVersionSummaryList,
  HistoryVersionSummary,
} from "@liveblocks/react-ui";
import { useHistoryVersions } from "@liveblocks/react";
import { HistoryVersionPreview } from "@liveblocks/react-tiptap";
import { Clock, Loader2Icon } from "lucide-react";

export default function VersionHistory({ editor, isOpen, setOpen }) {

  const onVersionRestore = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      {/* <Dialog.Trigger className="inline-flex relative items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-8 h-8">
        <Clock className="text-gray-700 size-5"/>
      </Dialog.Trigger> */}

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0 cursor-pointer" />
        <Dialog.Content className="rounded-xl border border-border bg-card text-card-foreground shadow text-sm overflow-hidden fixed top-[50%] left-[50%] h-[75vh] w-[80vw] translate-x-[-50%] translate-y-[-50%] outline-none z-20">
          <Dialog.Title className="sr-only">Versions</Dialog.Title>
          <Dialog.Description className="sr-only">
            Previous versions of this document
          </Dialog.Description>
          {editor && <Versions onVersionRestore={onVersionRestore} editor={editor} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Versions({ onVersionRestore, editor }: { onVersionRestore: () => void, editor: Editor }) {
  const [selectedVersionId, setSelectedVersionId] = useState<string>();
  const { versions, isLoading } = useHistoryVersions();
  const selectedVersion = useMemo(
    () => versions?.find((version) => version.id === selectedVersionId),
    [selectedVersionId, versions]
  );

  return isLoading ? <Loader2Icon className="animate-spin"/> : versions?.length === 0 ? (
    <div className="flex h-full items-center justify-center p-6 text-muted-foreground">
      No versions yet
    </div>
  ) : (
    <div className="flex h-full">
      <div className="flex-1 h-full min-w-0">
        {selectedVersion ? (
          <HistoryVersionPreview
            className="w-full h-full" onVersionRestore={onVersionRestore} version={selectedVersion} editor={editor} />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-muted-foreground">
            No version selected
          </div>
        )}
      </div>
      <div className="text-sm relative w-[250px] h-full overflow-auto border-l border-border/80">
        <HistoryVersionSummaryList>
          {versions?.map((version) => (
            <HistoryVersionSummary
              onClick={() => {
                setSelectedVersionId(version.id);
              }}
              key={version.id}
              version={version}
              selected={version.id === selectedVersionId}
            />
          ))}
        </HistoryVersionSummaryList>
      </div>
    </div>
  );
}