import { postgres } from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env");
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function setup() {
  console.log("Applying RLS policies and triggers...");
  try {
    // 1. Enable RLS
    await sql`ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`;
    await sql`ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;`;
    await sql`ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;`;
    await sql`ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;`;

    // 2. Draft policies (basic version)
    await sql`DROP POLICY IF EXISTS "Profiles are viewable by owner" ON public.profiles;`;
    await sql`CREATE POLICY "Profiles are viewable by owner" ON public.profiles FOR SELECT USING (auth.uid() = id);`;
    
    await sql`DROP POLICY IF EXISTS "Invoices are viewable by owner" ON public.invoices;`;
    await sql`CREATE POLICY "Invoices are viewable by owner" ON public.invoices FOR SELECT USING (auth.uid() = user_id);`;
    
    await sql`DROP POLICY IF EXISTS "Invoices are insertable by owner" ON public.invoices;`;
    await sql`CREATE POLICY "Invoices are insertable by owner" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);`;

    console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Setup failed:", err);
  } finally {
    await sql.end();
  }
}

setup();
