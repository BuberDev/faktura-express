Specyfikacja Techniczna: Project "Faktura Express"
1. Project Overview & Identity
Name: Faktura Express
Target Audience: Polish entrepreneurs (B2B).
Primary Language: UI in Polish, Source Code/URLs/Database in English.
Core Value: Premium, fast, and secure invoicing for free.
Visual Identity:
Luxury Modernism: Only Black, White, and Gold.
Strict No-Blue Policy: Zero blue shades in the entire application.
Light Mode: Background: #FFFFFF, Text: #000000, Accents: #D4AF37 (Gold) / #F9E79F (Light Gold).
Dark Mode: Background: #000000 (Pure Black), Text: #FFFFFF, Accents: #D4AF37 (Gold).
2. Technical Stack (The "Source of Truth")
Framework: Next.js 14+ (App Router).
Language: TypeScript (Strict mode).
Styling: Tailwind CSS + Shadcn UI (modified to Gold/Black/White).
Backend/Auth/Database: Supabase.
Animations: Framer Motion (for Hero Section).
PDF Generation: @react-pdf/renderer.
Form Handling: React Hook Form + Zod.
3. Architecture & File Structure (Clean Architecture)
The agent must follow this directory structure to ensure SOLID and Clean Code principles:
code
Text
src/
  app/ (Routes - English slub names)
    auth/ (login, register, forgot-password)
    dashboard/ (main view)
    invoices/ (index, new, [id])
    settings/ (profile, company-data)
  core/ (Business Logic - Framework Independent)
    domain/ (Interfaces, Types, Entities - e.g., InvoiceEntity)
    use-cases/ (Logic, e.g., CalculateTax, ValidateNip)
  infrastructure/ (External Services)
    supabase/ (Client, Queries)
    api/ (GUS API integration)
    pdf/ (Templates)
  components/ (UI - Atomic Design)
    ui/ (Shadcn base)
    invoice/ (InvoiceForm, InvoicePreview)
    landing/ (HeroAnimation)
4. Database Schema (Supabase/PostgreSQL)
Agent must create these tables with Row Level Security (RLS) enabled:
profiles: id (uuid, PK), email, company_name, nip, address, bank_account, gold_subscription (bool).
clients: id, user_id (FK), name, nip, address, email.
invoices: id, user_id (FK), number (unique per user/year), type (VAT, Proforma, Correction), issue_date, sale_date, due_date, status (unpaid, paid), total_net, total_vat, total_gross.
invoice_items: id, invoice_id (FK), description, quantity, unit (szt, godz, km), net_price, vat_rate (23, 8, 5, 0, zw, np).
5. Key Functional Workflows for Agent
A. Authentication Flow (High Security)
Registration: Email + Password + Confirm Password. Regex validation: min 8 chars, 1 uppercase, 1 special char.
OAuth: Google Auth integration via Supabase.
Password Reset: "Forgot password" flow sending a magic link/reset token via Supabase Auth.
Middleware: Protection of /dashboard, /invoices, and /settings. Unauthorized users redirect to /auth/login.
B. Landing Page Hero Animation
Layout: Two-column split.
Left Side: A "Skeleton" / Empty Invoice state (minimalist borders).
Right Side: An interactive, filled invoice that "animates in" using Framer Motion (typing effect for NIP, numbers rolling up, gold checkmark appearing).
Speed Factor: User must feel that "creating an invoice takes 10 seconds".
C. Invoice Logic (Polish Law Compliance)
NIP Validation: Check NIP via checksum algorithm.
GUS Integration: Fetch data from https://wyszukiwarkaregon.stat.gov.pl/app/ (BIR1.1) after entering NIP.
VAT Calculations:
Gross = Net * (1 + VAT_Rate)
Precision: Always round to 2 decimal places (use Decimal.js or equivalent for financial accuracy).
Format: Support Polish currency (PLN) formatting (e.g., 1 234,56 zł).
6. Visual Style Guide (Tailwind Config)
Agent must inject this into tailwind.config.ts:
code
TypeScript
colors: {
  border: "hsl(var(--border))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  gold: {
    DEFAULT: "#D4AF37",
    foreground: "#FFFFFF",
    light: "#F9E79F",
    dark: "#996515",
  },
  black: "#000000",
  white: "#FFFFFF",
},
// No blue colors in the configuration.
7. Instructions for Coding Agent (Anti-Hallucination)
Do not use Polish in file names or variable names. All backend/logic must be in English.
UI Content only in Polish. (Labels, placeholders, messages).
Strict SOLID: Separate the PDF generation logic from the React Component. Use a Service pattern.
Security: Always implement Supabase RLS. Never allow a user to fetch another user's invoice by ID.
Shadcn/UI: When installing Shadcn, replace the default blue primary color with gold.
Real-time Preview: The invoice form and the PDF preview must be side-by-side on desktop, or use a "Live Preview" toggle on mobile.
8. Visual Depth & Elevation (Borders, Shadows, Gradients)
Aby uzyskać efekt Premium/Luxury, Agent musi zastosować poniższe wytyczne dla stanów Light i Dark mode:
A. Borders (Obramowania)
Light Mode:
Standard: 1px solid #E5E5E5 (bardzo subtelny szary).
Premium Card: 1px solid #D4AF37 (złoty) z niskim kryciem (np. 20%).
Dark Mode:
Standard: 1px solid #262626 (ciemny grafit, prawie czarny).
Premium Card: 1px solid #D4AF37 (złoty) – używany do podświetlania aktywnych elementów.
Radius: Zaokrąglenia rogów stałe: radius: 0.5rem (Shadcn md).
B. Shadows (Cienie)
Light Mode:
Soft Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) (bardzo lekki, czysty cień).
Gold Glow (Hover): 0 10px 15px -3px rgba(212, 175, 55, 0.15) (delikatna złota poświata przy najechaniu na przycisk).
Dark Mode:
Elevation Shadow: 0 4px 10px rgba(0, 0, 0, 0.9) (głęboka czerń oddzielająca warstwy).
Gold Glow (Active): 0 0 15px rgba(212, 175, 55, 0.1) (subtelna iluminacja złota, aby element "odstawał" od czarnego tła).
C. Gradients (Gradienty)
Gold Gradient (Primary): linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%).
Używany wyłącznie do: Głównego przycisku "Wystaw Fakturę", ikon premium oraz nagłówka podsumowania.
Surface Gradient (Light): linear-gradient(to bottom, #FFFFFF, #F9F9F9) (delikatne przejście na kartach).
Surface Gradient (Dark): linear-gradient(to bottom, #0A0A0A, #000000) (subtelne odróżnienie kart od tła strony).
Zaktualizowany fragment konfiguracji tailwind.config.ts dla Agenta:
code
TypeScript
// Do wstrzyknięcia w tailwind.config.ts
extend: {
  boxShadow: {
    'gold-sm': '0 1px 2px 0 rgba(212, 175, 55, 0.05)',
    'gold-md': '0 4px 6px -1px rgba(212, 175, 55, 0.1), 0 2px 4px -1px rgba(212, 175, 55, 0.06)',
    'gold-lg': '0 10px 15px -3px rgba(212, 175, 55, 0.15), 0 4px 6px -2px rgba(212, 175, 55, 0.05)',
  },
  backgroundImage: {
    'gold-metallic': 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)',
    'dark-surface': 'linear-gradient(to bottom, #111111, #000000)',
  },
  borderWidth: {
    'DEFAULT': '1px',
    '0': '0',
    '2': '2px',
    'premium': '1px',
  },
  borderColor: {
    'gold-subtle': 'rgba(212, 175, 55, 0.2)',
  }
}
Dlaczego to jest kluczowe dla AI?
Głębia w Dark Mode: W czarnym trybie (Pure Black #000000) bez odpowiednich gradientów powierzchni (dark-surface) i cieni, wszystkie elementy zlewają się w jedną plamę. Dzięki tym wytycznym AI stworzy warstwy.
Efekt "Gold Metallic": Sam kolor #D4AF37 jest matowy. Gradient, który podałem powyżej (#BF953F do #FCF6BA), symuluje odbicie światła na złocie, co daje efekt luksusu.
Spójność stanów (Hover/Active): Agent będzie wiedział, że przycisk nie ma tylko zmieniać koloru, ale ma "świecić" na złoto (gold-glow) po najechaniu myszką.
