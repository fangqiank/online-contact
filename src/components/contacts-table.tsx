"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import { MoreHorizontal, Pencil, Trash2, User, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";

/** 列定义 */
interface ColumnDef {
  key: string;
  label: string;
  className?: string;
  sortable?: boolean;
}

const columns: ColumnDef[] = [
  { key: "name", label: "姓名", sortable: true },
  { key: "employeeId", label: "工号", className: "hidden md:table-cell", sortable: true },
  { key: "email", label: "邮箱", className: "hidden sm:table-cell" },
  { key: "phone", label: "电话", className: "hidden lg:table-cell" },
  { key: "department", label: "部门", className: "hidden lg:table-cell" },
  { key: "position", label: "职位", className: "hidden xl:table-cell", sortable: true },
  { key: "status", label: "状态" },
];

interface ContactsTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  sort: string;
  order: "asc" | "desc";
}

export function ContactsTable({
  contacts,
  onEdit,
  onDelete,
  sort,
  order,
}: ContactsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSort(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === key) {
      // 同列切换方向：asc → desc → asc
      params.set("order", order === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", key);
      params.set("order", "asc");
    }
    params.delete("page"); // 切换排序时回到第一页
    router.push(`?${params.toString()}`);
  }

  function SortIcon({ columnKey }: { columnKey: string }) {
    if (sort !== columnKey) {
      return <ArrowUpDown className="ml-1 size-3 opacity-40 group-hover:opacity-80" />;
    }
    return order === "asc"
      ? <ArrowUp className="ml-1 size-3" />
      : <ArrowDown className="ml-1 size-3" />;
  }

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
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.className}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="group inline-flex items-center hover:text-foreground cursor-pointer -ml-1 px-1 rounded transition-colors"
                  >
                    {col.label}
                    <SortIcon columnKey={col.key} />
                  </button>
                ) : (
                  col.label
                )}
              </TableHead>
            ))}
            <TableHead className="w-[50px]">
              <span className="sr-only">操作</span>
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
