'use client';

import { Button } from '@/components/ui/button';
import { SectionShell } from '@/components/workspace/section-shell';
import { useDocuments } from '@/hooks/use-documents';
import { FileText, Upload } from 'lucide-react';
import { DocumentUploaderModal } from '@/components/documents/document-uploader-modal';
import { DocumentTable } from '@/components/documents/document-table';
import { DataState } from '@/components/ui/data-state';

export default function DocumentsPage() {
  const { data: allDocuments = [], isLoading, error } = useDocuments();

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
      <DataState
        isLoading={isLoading}
        isError={!!error}
        error={error as Error}
        isEmpty={allDocuments.length === 0}
        emptyIcon={FileText}
        emptyTitle="No documents found"
        emptyDescription="Get started by uploading documents to your collections. AI will process them automatically."
        emptyAction={
          <DocumentUploaderModal>
            <Button className="gap-2 shadow-sm rounded-lg">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </DocumentUploaderModal>
        }
      >
        <DocumentTable documents={allDocuments} />
      </DataState>
    </SectionShell>
  );
}
