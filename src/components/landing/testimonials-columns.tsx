"use client";

import React from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    text: "Pobieranie danych z GUS działa w ułamku sekundy. Od teraz zamiast przepisywać adresy klientów, wystawiam fakturę jednym kliknięciem.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    name: "Anna Kowalska",
    role: "Właścicielka Agencji Marketingowej",
  },
  {
    text: "Szukałem narzędzia, które będzie szybkie, darmowe i bez irytujących reklam. Faktura In to strzał w dziesiątkę pod każdym względem.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    name: "Marek Domański",
    role: "Programista B2B",
  },
  {
    text: "Jakość generowanych PDF-ów to poezja. W końcu moje faktury wyglądają profesjonalnie i minimalistycznie, co podoba się moim klientom premium.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    name: "Piotr Nowicki",
    role: "Architekt Wnętrz",
  },
  {
    text: "Najszybsze logowanie przez Google, zero ukrytych abonamentów i natychmiastowy dostęp do wszystkich faktur z każdego urządzenia.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80",
    name: "Agnieszka Szulc",
    role: "Konsultant IT",
  },
  {
    text: "To narzędzie pozwoliło nam przenieść fakturowanie na o wiele wyższy poziom. Oszczędzamy czas na formalnościach i skupiamy się na pracy.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    name: "Katarzyna Wiśniewska",
    role: "Studio Fryzjerskie",
  },
  {
    text: "Świetny, elegancki interfejs. Jako UX Designer zwracam na to ogromną uwagę – widać, że aplikacja została zaprojektowana bez kompromisów.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80",
    name: "Kamil Kamiński",
    role: "Product Designer",
  },
  {
    text: "Przestałem się denerwować opłatami za programy księgowe. Mam to, czego potrzebuję (faktury, klientów, bazę PDF) zupełnie za darmo.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    name: "Michał Zalewski",
    role: "Ekspert ds. Logistyki",
  },
  {
    text: "Brak zacięć, szybkie ładowanie i zero skomplikowanych menu. Ktoś doskonale przemyślał proces – to genialne w swojej prostocie.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    name: "Ewa Sławińska",
    role: "Copywriter",
  },
  {
    text: "Jestem w branży od 10 lat i korzystałem z wielu narzędzi. Faktura In jako jedyna dała tak luksusowy design dokumentów bez chowania go za paywallem.",
    image: "https://images.unsplash.com/photo-1504257432389-523431e1a18b?auto=format&fit=crop&w=160&q=80",
    name: "Bartosz Krupa",
    role: "Doradca Finansowy",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 shadow-gold-sm max-w-xs w-full transition-transform hover:-translate-y-1 hover:shadow-gold-md"
                  key={i}
                >
                  <div className="text-white/80 leading-snug">{text}</div>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-gold/20"
                    />
                    <div className="flex flex-col items-start">
                      <div className="font-semibold text-white tracking-tight leading-5">
                        {name}
                      </div>
                      <div className="text-sm text-gold-light opacity-80 tracking-tight leading-5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                         Podatnik B2B
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export const AnimatedTestimonialsSection = () => {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="container z-10 mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="border border-gold-subtle bg-white/5 backdrop-blur-sm shadow-gold-sm py-1.5 px-5 rounded-full text-sm uppercase tracking-widest text-gold-light font-medium">
              Opinie przedsiębiorców
            </div>
          </div>

          <h2 className="text-3xl font-display tracking-tight text-white mb-6">
            Mówią o nas ci, dla których liczy się jakość prac.
          </h2>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={35} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={45} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={38} />
        </div>
      </div>
    </section>
  );
};
