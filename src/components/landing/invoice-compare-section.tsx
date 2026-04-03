import { Badge } from "@/components/ui/badge";
import { Compare } from "@/components/ui/compare";

export function InvoiceCompareSection() {
  return (
    <section id="porownanie" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <Badge className="mb-4 uppercase tracking-[0.2em]">Porównanie</Badge>
          <h2 className="max-w-xl font-display text-4xl leading-tight md:text-5xl">
            Od pustej faktury do gotowego dokumentu w kilka sekund.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-black/72 dark:text-white/72">
            Najedź kursorem albo przeciągnij suwak, aby zobaczyć, jak szybko formularz zamienia się w pełną fakturę
            zgodną z polskim standardem, gotową do pobrania PDF i wysyłki do klienta.
          </p>

          <div className="mt-7 grid gap-3">
            <div className="rounded-md border border-[#E5E5E5] bg-white/90 px-4 py-3 text-sm dark:border-[#262626] dark:bg-black/40">
              <span className="font-semibold text-gold-dark dark:text-gold-light">Lewa strona:</span> stan pustej faktury
            </div>
            <div className="rounded-md border border-gold-subtle bg-gold/10 px-4 py-3 text-sm">
              <span className="font-semibold text-gold-dark dark:text-gold-light">Prawa strona:</span> wypełniona faktura z wyliczeniami
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gold-subtle bg-gradient-to-b from-white via-[#FCF6BA]/20 to-[#F9F9F9] p-4 shadow-gold-lg dark:bg-dark-surface sm:p-5">
          <Compare
            firstImage="/invoice-empty-state.svg"
            secondImage="/invoice-filled-state.svg"
            firstImageClassName="object-cover object-left-top"
            secondImageClassname="object-cover object-left-top"
            className="h-[280px] w-full sm:h-[420px]"
            slideMode="hover"
            initialSliderPercentage={38}
          />
        </div>
      </div>
    </section>
  );
}
