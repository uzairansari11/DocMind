'use client';

import { Button } from '@/components/ui/button';
import { SectionShell } from '@/components/workspace/section-shell';
import { useDocuments } from '@/hooks/use-documents';
import { cn } from '@/lib/utils';
import { FileText, Loader2, Folder, Upload } from 'lucide-react';
import { DocumentUploaderModal } from '@/components/documents/document-uploader-modal';
import { toast } from 'sonner';

export default function DocumentsPage() {
  const { data: allDocuments = [], isLoading } = useDocuments();

  return (
    <SectionShell
      eyebrow="Knowledge Base"
      title="All Documents"
      action={
        <DocumentUploaderModal>
          <Button className="gap-2 shadow-sm rounded-lg">
            <Upload className="h-4 w-4" />
            Upload New
          </Button>
        </DocumentUploaderModal>
      }
    >
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : allDocuments.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 p-12 text-center animate-in fade-in duration-500">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted shadow-sm">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-normal tracking-tight text-foreground">No documents found</h3>
          <p className="mb-8 max-w-sm text-sm text-muted-foreground">
            Get started by uploading documents to your collections. AI will process them automatically.
          </p>
          <DocumentUploaderModal>
             <Button className="gap-2 shadow-sm rounded-lg">
               <Upload className="h-4 w-4" />
               Upload Document
             </Button>
          </DocumentUploaderModal>
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-normal border-b border-border/40">
                <tr>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Collection</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {allDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-[300px]">
                          {doc.title || doc.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Folder className="h-4 w-4 shrink-0" />
                        <span className="truncate max-w-[150px]">{doc.collection.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        doc.status === 'COMPLETED' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        doc.status === 'FAILED' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      )}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
