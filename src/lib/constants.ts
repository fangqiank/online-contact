import { contacts } from "@/db/schema";
import type { PgColumn } from "drizzle-orm/pg-core";

/** 可排序列的 key 列表，服务端和 UI 共用 */
export const sortableColumnKeys = [
  "name",
  "employeeId",
  "position",
  "hireDate",
  "salaryLevel",
] as const;

export type SortableColumnKey = (typeof sortableColumnKeys)[number];

/** 服务端排序用：key → Drizzle 列映射 */
export const sortableColumns: Record<SortableColumnKey, PgColumn> = {
  name: contacts.name,
  employeeId: contacts.employeeId,
  position: contacts.position,
  hireDate: contacts.hireDate,
  salaryLevel: contacts.salaryLevel,
};
