'use client';

import { DocumentUploader } from '@/components/documents/document-uploader';
import { Button } from '@/components/ui/button';
import { SectionShell } from '@/components/workspace/section-shell';
import { fetchCollections } from '@/lib/collections';
import { useQuery } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Loader2, Plus, ArrowRight, Check, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function UploadPage() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [open, setOpen] = useState(false);

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
  });

  return (
    <SectionShell
      eyebrow="Data Ingestion"
      title="Upload Documents"
      action={
        <Link href="/collections">
           <Button variant="outline" className="gap-2 shadow-sm rounded-lg">
             Go to Collections
             <ArrowRight className="h-4 w-4" />
           </Button>
        </Link>
      }
    >
      <div className="max-w-3xl space-y-8">
        <div>
           <p className="text-muted-foreground">
             Upload PDF, text, or markdown files. We'll automatically process and vectorize them so you can chat with your data instantly.
           </p>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 p-12 text-center animate-in fade-in duration-500">
            <h3 className="mb-2 text-lg font-normal tracking-tight text-foreground">Create a collection first</h3>
            <p className="mb-8 max-w-sm text-sm text-muted-foreground">
              You need at least one collection to upload documents. Collections help you organize your files.
            </p>
            <Link href="/collections">
              <Button className="gap-2 shadow-sm rounded-lg">
                <Plus className="h-4 w-4" />
                Create Collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Target Selection */}
            <div className="space-y-3 flex flex-col">
              <label htmlFor="collection" className="block text-sm font-medium text-foreground mb-2">
                Target Collection
              </label>
              
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  className="inline-flex items-center justify-between whitespace-nowrap w-full h-12 rounded-xl border border-border bg-background px-4 text-sm font-normal shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="truncate flex-1 text-left">
                    {selectedCollectionId
                      ? collections.find((c) => c.id === selectedCollectionId)?.title
                      : "Select a collection to upload into..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[500px] md:w-[600px] lg:w-[700px] p-0 rounded-xl" align="start">
                  <Command>
                    <CommandInput placeholder="Search collections..." />
                    <CommandList>
                      <CommandEmpty>No collection found.</CommandEmpty>
                      <CommandGroup>
                        {collections.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={c.title}
                            onSelect={() => {
                              setSelectedCollectionId(c.id === selectedCollectionId ? "" : c.id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedCollectionId === c.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {c.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Upload Area */}
            {selectedCollectionId && (
              <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                <DocumentUploader
                  collectionId={selectedCollectionId}
                  onUploadComplete={() => {}}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
