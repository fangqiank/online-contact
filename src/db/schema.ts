import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  hireDate: date("hire_date"),
  employeeId: varchar("employee_id", { length: 50 }),
  avatarUrl: text("avatar_url"),
  notes: text("notes"),
  emergencyContact: varchar("emergency_contact", { length: 255 }),
  address: text("address"),
  salaryLevel: varchar("salary_level", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
