"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { templates, templateCategories } from "@/lib/templates/templates";
import { Crown } from "lucide-react";
import { Badge } from "../ui/badge";
import UseSubscription from "@/hooks/use-subscription";

export function TemplatesDialog({ trigger, onSelectTemplate }) {
  const [open, setOpen] = React.useState(false);

  const handleSelectTemplate = (templateId) => {
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose a template</DialogTitle>
          <DialogDescription>
            Select a template to quickly start your document
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="all" className="mt-2">
          <TabsList className="mb-4">
            {templateCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {templateCategories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="mt-0 flex-1 overflow-hidden"
            >
              <ScrollArea
                className="flex-1 pr-4 overflow-y-auto"
                style={{ maxHeight: "calc(85vh - 180px)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {templates
                    .filter((template) =>
                      template.categories.includes(category.id)
                    )
                    .map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onClick={() => handleSelectTemplate(template.id)}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function TemplateCard({ template, onClick }) {
  const { hasActiveSubscription } = UseSubscription();
  const isProTemplate = template.status === "Pro";
  const isDisabled = isProTemplate && !hasActiveSubscription;

  return (
    <button
      className={cn(
        "group flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isDisabled && "opacity-60 cursor-not-allowed hover:bg-transparent"
      )}
      onClick={() => !isDisabled && onClick()}
      disabled={isDisabled}
    >
      <div className="flex items-center justify-between w-full">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md border",
            "bg-background group-hover:border-primary",
            isDisabled && "group-hover:border-muted"
          )}
        >
          <template.icon className="h-5 w-5" />
        </div>
        {template.status === "Pro" && (
          <Badge
            variant={hasActiveSubscription ? "default" : "default"}
            className="ml-2 border-yellow-500"
          >
            {isDisabled && <Crown className="size-4 mr-1" />}
            Pro
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold">{template.name}</h3>
        <p className="text-sm text-muted-foreground">
          {isDisabled
            ? "Upgrade to Pro to use this template"
            : template.description}
        </p>
      </div>
    </button>
  );
}
