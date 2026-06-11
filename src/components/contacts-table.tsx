"use client";

import type { Contact } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, User } from "lucide-react";
import Image from "next/image";

interface ContactsTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactsTable({
  contacts,
  onEdit,
  onDelete,
}: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <User className="size-12 mb-4 opacity-40" />
        <p className="text-lg font-medium">未找到人员</p>
        <p className="text-sm">请尝试调整搜索条件或筛选器</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead className="hidden md:table-cell">工号</TableHead>
            <TableHead className="hidden sm:table-cell">邮箱</TableHead>
            <TableHead className="hidden lg:table-cell">电话</TableHead>
            <TableHead className="hidden lg:table-cell">部门</TableHead>
            <TableHead className="hidden xl:table-cell">职位</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="w-[50px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {contact.avatarUrl ? (
                    <Image
                      src={contact.avatarUrl}
                      alt={contact.name}
                      width={32}
                      height={32}
                      className="size-8 rounded-full bg-muted"
                      unoptimized
                    />
                  ) : (
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="font-medium">{contact.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {contact.employeeId ?? "-"}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {contact.email ?? "-"}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {contact.phone ?? "-"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {contact.department ?? "-"}
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                {contact.position ?? "-"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    contact.status === "active" ? "default" : "secondary"
                  }
                >
                  {contact.status === "active" ? "在职" : "离职"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="inline-flex size-8 items-center justify-center rounded-md hover:bg-accent"
                  >
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">打开菜单</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(contact)}>
                      <Pencil className="size-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(contact)}
                    >
                      <Trash2 className="size-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
