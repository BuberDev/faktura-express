import { Badge } from "@/components/ui/badge";
import { Compare } from "@/components/ui/compare";

export function InvoiceCompareSection() {
  return (
    <section id="porownanie" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <Badge className="mb-4 uppercase tracking-[0.2em]">Porównanie</Badge>
          <h2 className="max-w-xl font-display text-4xl leading-tight md:text-5xl text-white">
            Od pustej faktury do gotowego dokumentu w kilka sekund.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
            Najedź kursorem albo przeciągnij suwak, aby zobaczyć, jak szybko formularz zamienia się w pełną fakturę
            zgodną z polskim standardem, gotową do pobrania PDF i wysyłki do klienta.
          </p>

          <div className="mt-7 grid gap-3">
            <div className="rounded-md border border-white/10 bg-white/10 px-4 py-3 text-sm">
              <span className="font-semibold text-gold-light">Lewa strona:</span> <span className="text-white/90">stan pustej faktury</span>
            </div>
            <div className="rounded-md border border-gold-subtle bg-gold/10 px-4 py-3 text-sm">
              <span className="font-semibold text-gold-light">Prawa strona:</span> <span className="text-white/90">wypełniona faktura z wyliczeniami</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gold-subtle bg-white/5 p-4 shadow-gold-lg dark:bg-black/20 backdrop-blur-md sm:p-5">
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
