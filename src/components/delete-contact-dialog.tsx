"use client";

import type { Contact } from "@/lib/types";
import { deleteContact } from "@/app/actions/contacts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface DeleteContactDialogProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteContactDialog({
  contact,
  open,
  onOpenChange,
}: DeleteContactDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!contact) return;
    setLoading(true);
    const result = await deleteContact(contact.id);
    setLoading(false);
    if (result.success) {
      toast.success("人员已删除");
      onOpenChange(false);
    } else {
      toast.error(result.error ?? "删除失败，请重试");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除人员</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除{" "}
            <span className="font-medium text-foreground">
              {contact?.name}
            </span>
            {" "}吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
