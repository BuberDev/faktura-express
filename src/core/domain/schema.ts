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
  id: uuid("id").primaryKey().notNull(),
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
    userId: uuid("user_id").notNull(),
    number: text("number").notNull(),
    type: text("type").notNull(), // VAT, Proforma, Correction, Bill, Receipt, Offer
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

    ksefStatus: text("ksef_status").notNull().default("none"),
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
  unit: text("unit").notNull(),
  netPrice: numeric("net_price", { precision: 15, scale: 2 }).notNull(),
  vatRate: text("vat_rate").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Clients ──────────────────────────────────────────────────────────────────

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  nip: text("nip"),
  address: text("address"),
  email: text("email"),
  phone: text("phone"),
  bankAccount: text("bank_account"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── Products / Services ───────────────────────────────────────────────────────

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  unit: text("unit").notNull().default("szt"), // szt, godz, km, …
  netPrice: numeric("net_price", { precision: 15, scale: 2 }).notNull(),
  vatRate: text("vat_rate").notNull().default("23"),
  sku: text("sku"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── Costs (purchase invoices / expenses) ─────────────────────────────────────

export const costs = pgTable("costs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  number: text("number").notNull(),
  type: text("type").notNull().default("invoice"), // invoice, purchase, order, ksef
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date").notNull(),
  status: text("status").notNull().default("unpaid"), // unpaid, paid
  vendorName: text("vendor_name").notNull(),
  vendorNip: text("vendor_nip"),
  vendorAddress: text("vendor_address"),
  totalNet: numeric("total_net", { precision: 15, scale: 2 }).notNull(),
  totalVat: numeric("total_vat", { precision: 15, scale: 2 }).notNull(),
  totalGross: numeric("total_gross", { precision: 15, scale: 2 }).notNull(),
  ksefId: text("ksef_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const costItems = pgTable("cost_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  costId: uuid("cost_id")
    .notNull()
    .references(() => costs.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 15, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  netPrice: numeric("net_price", { precision: 15, scale: 2 }).notNull(),
  vatRate: text("vat_rate").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Bank Accounts ─────────────────────────────────────────────────────────────

export const bankAccounts = pgTable("bank_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(), // e.g. "Konto PLN"
  iban: text("iban").notNull(),
  bankName: text("bank_name"),
  currency: text("currency").notNull().default("PLN"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── Payment Methods ───────────────────────────────────────────────────────────

export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(), // e.g. "Przelew", "Gotówka", "Karta"
  dueDays: numeric("due_days", { precision: 4, scale: 0 }).notNull().default("14"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── Relations ─────────────────────────────────────────────────────────────────

export const invoicesRelations = relations(invoices, ({ many }) => ({
  invoiceItems: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const costsRelations = relations(costs, ({ many }) => ({
  costItems: many(costItems),
}));

export const costItemsRelations = relations(costItems, ({ one }) => ({
  cost: one(costs, {
    fields: [costItems.costId],
    references: [costs.id],
  }),
}));

