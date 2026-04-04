/* eslint-disable @next/next/no-img-element */
import {
  AtSign,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Rss,
  Send,
} from "lucide-react";
import Link from "next/link";

const data = {
  facebookLink: "https://facebook.com",
  instaLink: "https://instagram.com",
  twitterLink: "https://twitter.com",
  githubLink: "https://github.com",
  dribbbleLink: "https://dribbble.com",
  services: {
    webdev: "/invoices/new",
    webdesign: "/dashboard",
    marketing: "/settings/company-data",
    googleads: "/settings/profile",
  },
  about: {
    history: "/",
    team: "/",
    handbook: "/",
    careers: "/",
  },
  help: {
    faqs: "/",
    support: "/",
    livechat: "/auth/login",
  },
  contact: {
    email: "kontakt@fakturain.pl",
    phone: "+48 500 700 900",
    address: "Warszawa, Polska",
  },
  company: {
    name: "Faktura In",
    description:
      "Nowoczesne fakturowanie B2B dla polskich przedsiębiorców. Szybko, bezpiecznie i w standardzie premium.",
    logo: "/logo.png",
  },
};

const socialLinks = [
  { icon: Globe, label: "Strona", href: data.facebookLink },
  { icon: AtSign, label: "Aktualnosci", href: data.instaLink },
  { icon: Send, label: "Kontakt", href: data.twitterLink },
  { icon: ExternalLink, label: "Repozytorium", href: data.githubLink },
  { icon: Rss, label: "Blog", href: data.dribbbleLink },
];

const aboutLinks = [
  { text: "O produkcie", href: data.about.history },
  { text: "Zespół", href: data.about.team },
  { text: "Standard bezpieczeństwa", href: data.about.handbook },
  { text: "Kariera", href: data.about.careers },
];

const serviceLinks = [
  { text: "Nowa faktura", href: data.services.webdev },
  { text: "Panel główny", href: data.services.webdesign },
  { text: "Dane firmy", href: data.services.marketing },
  { text: "Ustawienia profilu", href: data.services.googleads },
];

const helpfulLinks = [
  { text: "FAQ", href: data.help.faqs },
  { text: "Wsparcie", href: data.help.support },
  { text: "Czat na żywo", href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="mt-16 w-full place-self-end rounded-t-xl border-t border-gold-subtle bg-black/60 backdrop-blur-md text-white">
      <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center gap-2 text-white sm:justify-start">
              <img src={data.company.logo} alt="logo" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-2xl font-semibold">{data.company.name}</span>
            </div>

            <p className="mt-6 max-w-md text-center leading-relaxed text-white/70 sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gold-dark transition hover:text-gold" target="_blank" rel="noreferrer">
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">O nas</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link className="text-white/70 transition hover:text-gold-dark" href={href}>
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Narzędzia</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link className="text-white/70 transition hover:text-gold-dark" href={href}>
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Pomoc</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className={
                        hasIndicator
                          ? "group flex justify-center gap-1.5 sm:justify-start"
                          : "text-white/70 transition hover:text-gold-dark"
                      }
                    >
                      <span className="text-white/70 transition group-hover:text-gold-dark">{text}</span>
                      {hasIndicator ? (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-gold" />
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Kontakt</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                      <Icon className="size-5 shrink-0 text-gold-dark shadow-sm" />
                      {isAddress ? (
                        <address className="-mt-0.5 flex-1 not-italic text-white/70 transition">{text}</address>
                      ) : (
                        <span className="flex-1 text-white/70 transition">{text}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gold-subtle pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-white/70">
              <span className="block sm:inline">Wszelkie prawa zastrzeżone.</span>
            </p>

            <p className="mt-4 text-sm text-white/60 transition sm:order-first sm:mt-0">
              &copy; {new Date().getFullYear()} {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
