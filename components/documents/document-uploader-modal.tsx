import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUploadDocument } from '@/hooks/use-documents';
import { useCollections } from '@/hooks/use-collections';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Loader2, UploadCloud, X, FileText, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function DocumentUploaderModal({ 
  children, 
  defaultCollectionId,
}: { 
  children: React.ReactNode;
  defaultCollectionId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(defaultCollectionId || '');
  const [open, setOpen] = useState(false);
  const { data: collections = [], isLoading: isLoadingCollections } = useCollections();

  const { mutate, isPending } = useUploadDocument();
  
  const handleUpload = () => {
    if (!file) return;
    if (!selectedCollectionId) return;
    
    mutate({
      title: file.name,
      collectionId: selectedCollectionId,
      document: file,
    }, {
      onSuccess: () => {
        toast.success('Document uploaded successfully');
        setFile(null);
        setIsOpen(false);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(droppedFile);
      } else {
        toast.error('Only PDF files are allowed');
      }
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="inline-block">
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && setIsOpen(false)}>
        <DialogContent showCloseButton={!isPending}>
          <DialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a file to your knowledge base to chat with it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2 min-w-0 w-full">
            <div className="space-y-1.5 flex flex-col min-w-0">
              <label htmlFor="collection" className="block text-sm font-medium text-foreground">
                Target Collection
              </label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  disabled={!!defaultCollectionId || isLoadingCollections}
                  className="flex items-center justify-between w-full h-11 rounded-xl border border-border bg-background px-4 text-sm font-normal shadow-sm hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 min-w-0"
                >
                  <span className="truncate flex-1 text-left">
                    {selectedCollectionId
                      ? collections.find((c) => c.id === selectedCollectionId)?.title
                      : "Select a collection..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[350px] md:w-[400px] p-0 rounded-xl" align="start">
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

            {!file ? (
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border/60 bg-muted/5 py-10 text-center transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                <label className="flex w-full cursor-pointer flex-col items-center justify-center">
                  <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm border border-border/50 transition-transform group-hover:scale-110 group-hover:shadow-md">
                    <UploadCloud className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PDF up to 10MB</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected && (selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf'))) {
                        setFile(selected);
                      } else if (selected) {
                        toast.error('Only PDF files are allowed');
                      }
                    }} 
                    accept=".pdf,application/pdf"
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background p-3 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            
            <div className="pt-2 flex gap-3">
              <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isPending} className="flex-1 h-11">
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={isPending || !file || !selectedCollectionId}
                className="flex-1 h-11"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
