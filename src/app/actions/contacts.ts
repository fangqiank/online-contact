"use server";

import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { NewContact } from "@/lib/types";

export async function createContact(data: NewContact) {
  try {
    await db.insert(contacts).values(data);
    revalidatePath("/");
    return { success: true as const };
  } catch (error) {
    console.error("Failed to create contact:", error);
    return { success: false as const, error: "Failed to create contact" };
  }
}

export async function updateContact(id: number, data: Partial<NewContact>) {
  try {
    await db
      .update(contacts)
      .set({ ...data, updatedAt: sql`NOW()` })
      .where(eq(contacts.id, id));
    revalidatePath("/");
    return { success: true as const };
  } catch (error) {
    console.error("Failed to update contact:", error);
    return { success: false as const, error: "Failed to update contact" };
  }
}

export async function deleteContact(id: number) {
  try {
    await db.delete(contacts).where(eq(contacts.id, id));
    revalidatePath("/");
    return { success: true as const };
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return { success: false as const, error: "Failed to delete contact" };
  }
}
