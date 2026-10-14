import React from 'react';
import type { DocumentDto } from '@smartdoc/types';
import { DocumentCard } from './document-card';

export interface DocumentListProps {
  documents: DocumentDto[];
}

/**
 * List container for rendering read-only document cards.
 */
export function DocumentList({ documents }: DocumentListProps) {
  return (
    <section aria-label="รายการเอกสารราชการ" className="w-full">
      <ul
        role="list"
        aria-label="รายการเอกสารทั้งหมด"
        className="m-0 p-0 list-none space-y-3"
      >
        {documents.map((doc) => (
          <li key={doc.id}>
            <DocumentCard document={doc} />
          </li>
        ))}
      </ul>
    </section>
  );
}
