import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { InvoiceEntity } from "@/core/domain/entities/invoice-entity";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    color: "#000000",
    fontSize: 11,
  },
  section: {
    marginBottom: 12,
    borderBottom: "1 solid #E5E5E5",
    paddingBottom: 8,
  },
  heading: {
    fontSize: 18,
    marginBottom: 4,
    color: "#996515",
    fontWeight: 700,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1 solid #E5E5E5",
    paddingVertical: 6,
  },
  emphasized: {
    color: "#996515",
    fontWeight: 700,
  },
});

interface InvoicePdfTemplateProps {
  invoice: InvoiceEntity;
}

export function InvoicePdfTemplate({ invoice }: InvoicePdfTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Faktura {invoice.number}</Text>
          <View style={styles.row}>
            <Text>Typ: {invoice.type}</Text>
            <Text>Status: {invoice.status === "paid" ? "opłacona" : "nieopłacona"}</Text>
          </View>
          <View style={styles.row}>
            <Text>Data wystawienia: {invoice.issueDate}</Text>
            <Text>Termin płatności: {invoice.dueDate}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.emphasized}>Sprzedawca</Text>
          <Text>{invoice.issuer.name}</Text>
          <Text>NIP: {invoice.issuer.nip}</Text>
          <Text>{invoice.issuer.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.emphasized}>Nabywca</Text>
          <Text>{invoice.client.name}</Text>
          <Text>NIP: {invoice.client.nip}</Text>
          <Text>{invoice.client.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.emphasized}>Pozycje</Text>
          {invoice.items.map((item, index) => (
            <View key={`${item.description}-${index}`} style={styles.itemRow}>
              <Text>{item.description}</Text>
              <Text>
                {item.quantity} {item.unit} × {item.netPrice} PLN
              </Text>
            </View>
          ))}
        </View>

        <View>
          <View style={styles.row}>
            <Text>Razem netto</Text>
            <Text>{invoice.totalNet} PLN</Text>
          </View>
          <View style={styles.row}>
            <Text>VAT</Text>
            <Text>{invoice.totalVat} PLN</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.emphasized}>Do zapłaty</Text>
            <Text style={styles.emphasized}>{invoice.totalGross} PLN</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
