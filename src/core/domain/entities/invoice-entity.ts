import type {
  InvoiceItemInput,
  InvoiceParty,
  InvoiceStatus,
  InvoiceType,
} from "../types/invoice";

export interface InvoiceEntity {
  id: string;
  userId: string;
  number: string;
  type: InvoiceType;
  issueDate: string;
  saleDate: string;
  dueDate: string;
  status: InvoiceStatus;
  issuer: InvoiceParty;
  client: InvoiceParty;
  items: InvoiceItemInput[];
  totalNet: string;
  totalVat: string;
  totalGross: string;

  // KSeF & Draft Support
  isDraft: boolean;
  ksefStatus?: string;
  ksefId?: string;
  upoUrl?: string;
}
