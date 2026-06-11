"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ContactFiltersProps {
  departments: string[];
}

export function ContactFilters({ departments }: ContactFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? ""
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const currentDepartment = searchParams.get("department") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.delete("page");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams("search", value);
    }, 300);
  }

  function handleClearFilters() {
    setSearchValue("");
    router.push("?");
  }

  const hasFilters =
    searchValue || currentDepartment || currentStatus;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索姓名、邮箱、电话或工号..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={currentDepartment}
          onValueChange={(v) => updateParams("department", v === "_all" ? "" : (v as string))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="部门" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">全部部门</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={currentStatus}
          onValueChange={(v) => updateParams("status", v === "_all" ? "" : (v as string))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">全部状态</SelectItem>
            <SelectItem value="active">在职</SelectItem>
            <SelectItem value="resigned">离职</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={handleClearFilters}>
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
