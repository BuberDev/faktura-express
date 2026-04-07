import type { InvoiceEntity } from "@/core/domain/entities/invoice-entity";

export class KSeFService {
  /**
   * Generates a simplified FA(2) XML for KSeF.
   * Note: This is an architectural foundation. A production-ready 
   * implementation would require a full XML builder and all mandatory FA(2) fields.
   */
  generateFA3Xml(invoice: InvoiceEntity): string {
    const issueDate = invoice.issueDate;
    const saleDate = invoice.saleDate;
    const dueDate = invoice.dueDate;
    
    // FA(3) structure (mandatory from Feb 1, 2026)
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<Faktura xmlns:etd="http://crd.gov.pl/xml/schematy/dziedzinowe/mf/2022/01/05/eD/DefinicjeTypy/" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
         xmlns="http://crd.gov.pl/wzor/2024/11/15/13375/">
  <Naglowek>
    <KodFormularza kodSystemowy="FA (3)" wersjaSchemy="1-0E">FA</KodFormularza>
    <WariantFormularza>3</WariantFormularza>
    <DataWytworzeniaFa>${new Date().toISOString().split('.')[0]}Z</DataWytworzeniaFa>
    <KodUrzedu>0000</KodUrzedu>
  </Naglowek>
  <Podmiot1>
    <DaneIdentyfikacyjne>
      <NIP>${invoice.issuer.nip}</NIP>
      <Nazwa>${this.escapeXml(invoice.issuer.name)}</Nazwa>
    </DaneIdentyfikacyjne>
    <Adres>
      <KodKraju>PL</KodKraju>
      <AdresL1>${this.escapeXml(invoice.issuer.address)}</AdresL1>
    </Adres>
  </Podmiot1>
  <Podmiot2>
    <DaneIdentyfikacyjne>
      <NIP>${invoice.client.nip}</NIP>
      <Nazwa>${this.escapeXml(invoice.client.name)}</Nazwa>
    </DaneIdentyfikacyjne>
    <Adres>
      <KodKraju>PL</KodKraju>
      <AdresL1>${this.escapeXml(invoice.client.address)}</AdresL1>
    </Adres>
  </Podmiot2>
  <Fa>
    <KodWaluty>PLN</KodWaluty>
    <P_1>${issueDate}</P_1>
    <P_2>${this.escapeXml(invoice.number)}</P_2>
    <P_6>${saleDate}</P_6>
    <P_13_1>${invoice.totalNet}</P_13_1>
    <P_14_1>${invoice.totalVat}</P_14_1>
    <P_15>${invoice.totalGross}</P_15>
    <Adnotacje>
      <P_16>2</P_16>
      <P_17>2</P_17>
      <P_18>2</P_18>
      <P_18A>2</P_18A>
      <P_19>2</P_19>
      <P_22>2</P_22>
      <P_23>2</P_23>
      <P_PMarzy>2</P_PMarzy>
    </Adnotacje>
    <RodzajFaktury>VAT</RodzajFaktury>
    ${invoice.items.map((item, index) => `
    <FaWiersz>
      <NrWierszaFa>${index + 1}</NrWierszaFa>
      <P_7>${this.escapeXml(item.description)}</P_7>
      <P_8A>${item.unit}</P_8A>
      <P_8B>${item.quantity}</P_8B>
      <P_9A>${item.netPrice}</P_9A>
      <P_11>${item.netPrice}</P_11>
      <P_12>${item.vatRate}</P_12>
    </FaWiersz>`).join("")}
    <Platnosc>
       <TerminPlatnosci>
          <Termin>${dueDate}</Termin>
       </TerminPlatnosci>
    </Platnosc>
  </Fa>
</Faktura>`;

    return xml;
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "&": return "&amp;";
        case "'": return "&apos;";
        case "\"": return "&quot;";
        default: return c;
      }
    });
  }
}
