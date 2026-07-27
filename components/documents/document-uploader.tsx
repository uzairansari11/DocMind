import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadDocumentRequest } from '@/lib/documents';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, UploadCloud, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DocumentUploader({ collectionId, onUploadComplete }: { collectionId: string, onUploadComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!file) throw new Error('No file selected');
      return uploadDocumentRequest({
        title: file.name,
        collectionId,
        document: file,
      });
    },
    onSuccess: () => {
      toast.success('Document uploaded successfully');
      setFile(null);
      onUploadComplete();
    },
    onError: () => {
      toast.error('Failed to upload document');
    }
  });

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
    <div className="space-y-6">
      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border/60 bg-muted/5 py-12 text-center transition-all hover:border-primary/50 hover:bg-primary/5"
        >
          <label className="flex w-full cursor-pointer flex-col items-center justify-center">
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm border border-border/50 transition-transform group-hover:scale-110 group-hover:shadow-md">
              <UploadCloud className="h-7 w-7 text-primary" />
            </div>
            <p className="mb-2 text-base font-medium text-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">PDF up to 10MB</p>
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
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background p-4 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setFile(null)} disabled={isPending} className="rounded-xl h-12 px-6">
              Cancel
            </Button>
            <Button 
              onClick={() => mutate()} 
              disabled={isPending}
              className="rounded-xl h-12 px-8 gap-2 shadow-sm"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              Upload Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
