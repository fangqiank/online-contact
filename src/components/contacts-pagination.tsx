"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface ContactsPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function ContactsPagination({
  currentPage,
  totalPages,
  total,
  pageSize,
}: ContactsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }

  function changePageSize(size: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", String(size));
    params.delete("page"); // 切换条数时重置到第一页
    router.push(`?${params.toString()}`);
  }

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          共 {total} 条记录
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">每页</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => changePageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">条</span>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="flex size-8 items-center justify-center text-sm text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant={p === currentPage ? "default" : "outline"}
                size="icon"
                className="size-8"
                onClick={() => goToPage(p as number)}
              >
                {p}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function getPageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
