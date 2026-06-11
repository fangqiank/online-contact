import { db } from "@/db";
import { contacts } from "@/db/schema";
import { and, asc, count, desc, eq, ilike, isNotNull, ne, or } from "drizzle-orm";
import { sortableColumns, sortableColumnKeys } from "@/lib/constants";
import type { SortableColumnKey } from "@/lib/constants";

export interface GetContactsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  status?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export type { SortableColumnKey };
export { sortableColumnKeys };

export interface GetContactsResult {
  data: Awaited<ReturnType<typeof getContacts>> extends infer T
    ? T
    : never;
  total: number;
  totalPages: number;
}

export async function getContacts(params: GetContactsParams = {}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const offset = (page - 1) * pageSize;

  const conditions = [];

  if (params.search) {
    const term = `%${params.search}%`;
    const searchCondition = or(
      ilike(contacts.name, term),
      ilike(contacts.email, term),
      ilike(contacts.phone, term),
      ilike(contacts.employeeId, term)
    );
    if (searchCondition) conditions.push(searchCondition);
  }
  if (params.department) {
    conditions.push(eq(contacts.department, params.department));
  }
  if (params.status) {
    conditions.push(eq(contacts.status, params.status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // 动态排序：仅允许白名单中的列
  const sortKey = sortableColumnKeys.includes(params.sort as SortableColumnKey)
    ? (params.sort as SortableColumnKey)
    : null;
  const sortCol = sortKey ? sortableColumns[sortKey] : contacts.createdAt;
  const sortOrder = params.order === "asc" ? asc(sortCol) : desc(sortCol);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(contacts)
      .where(whereClause)
      .orderBy(sortOrder)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: count() })
      .from(contacts)
      .where(whereClause),
  ]);

  const total = totalResult[0].count;

  return { data, total, totalPages: Math.ceil(total / pageSize) };
}

export async function getContactById(id: number) {
  const result = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id));
  return result[0] ?? null;
}

export async function getDepartments(): Promise<string[]> {
  const result = await db
    .selectDistinct({ department: contacts.department })
    .from(contacts)
    .where(and(isNotNull(contacts.department), ne(contacts.department, "")));
  return result.map((r) => r.department!);
}
