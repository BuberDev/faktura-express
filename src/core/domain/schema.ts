import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().notNull(), // References auth.users(id)
  email: text("email").notNull().unique(),
  companyName: text("company_name"),
  nip: text("nip"),
  address: text("address"),
  bankAccount: text("bank_account"),
  avatarUrl: text("avatar_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(), // References auth.users(id)
    number: text("number").notNull(),
    type: text("type").notNull(), // VAT, Proforma, Correction
    issueDate: date("issue_date").notNull(),
    saleDate: date("sale_date").notNull(),
    dueDate: date("due_date").notNull(),
    status: text("status").notNull(), // unpaid, paid

    issuerName: text("issuer_name").notNull(),
    issuerNip: text("issuer_nip").notNull(),
    issuerAddress: text("issuer_address").notNull(),

    clientName: text("client_name").notNull(),
    clientNip: text("client_nip").notNull(),
    clientAddress: text("client_address").notNull(),

    totalNet: numeric("total_net", { precision: 15, scale: 2 }).notNull(),
    totalVat: numeric("total_vat", { precision: 15, scale: 2 }).notNull(),
    totalGross: numeric("total_gross", { precision: 15, scale: 2 }).notNull(),
    
    template: text("template").notNull().default("classic"),
    
    // KSeF related fields
    ksefStatus: text("ksef_status").notNull().default("none"), // none, pending, accepted, rejected
    ksefId: text("ksef_id"),
    upoUrl: text("upo_url"),
    
    isDraft: boolean("is_draft").notNull().default(false),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userNumberUnique: unique("invoice_user_number_unique").on(
      table.userId,
      table.number
    ),
  }),
);

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 15, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // szt, godz, km
  netPrice: numeric("net_price", { precision: 15, scale: 2 }).notNull(),
  vatRate: text("vat_rate").notNull(), // 23, 8, 5, 0, zw, np
  createdAt: timestamp("created_at").defaultNow(),
});

export const invoicesRelations = relations(invoices, ({ many }) => ({
  invoiceItems: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));
