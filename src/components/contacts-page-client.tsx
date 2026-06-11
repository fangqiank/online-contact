"use client";

import { useState } from "react";
import type { Contact } from "@/lib/types";
import { ContactFilters } from "@/components/contact-filters";
import { ContactsTable } from "@/components/contacts-table";
import { ContactForm } from "@/components/contact-form";
import { DeleteContactDialog } from "@/components/delete-contact-dialog";
import { ContactsPagination } from "@/components/contacts-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ContactsPageClientProps {
  contacts: Contact[];
  totalPages: number;
  total: number;
  currentPage: number;
  pageSize: number;
  departments: string[];
}

export function ContactsPageClient({
  contacts,
  totalPages,
  total,
  currentPage,
  pageSize,
  departments,
}: ContactsPageClientProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">人员管理</h1>
          <p className="text-sm text-muted-foreground">
            管理组织的人员通讯录
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          添加人员
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <ContactFilters departments={departments} />
      </div>

      {/* Table */}
      <ContactsTable
        contacts={contacts}
        onEdit={(contact) => setEditContact(contact)}
        onDelete={(contact) => setDeleteTarget(contact)}
      />

      {/* Pagination */}
      <ContactsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
      />

      {/* Create Dialog */}
      <ContactForm open={createOpen} onOpenChange={setCreateOpen} />

      {/* Edit Dialog */}
      <ContactForm
        contact={editContact}
        open={!!editContact}
        onOpenChange={(open) => {
          if (!open) setEditContact(null);
        }}
      />

      {/* Delete Dialog */}
      <DeleteContactDialog
        contact={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
