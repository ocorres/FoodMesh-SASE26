import type { DonationIntake, RecipientMatch } from "./food";

export type PersistenceResult = {
  persisted: boolean;
  storage: "supabase" | "demo";
  id?: string;
  note?: string;
};

export type PersistedDonation = {
  id: string;
  donation: DonationIntake;
  matches: RecipientMatch[];
  intake_mode: "ai" | "demo";
  created_at: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;
  return { url, key };
}

function supabaseHeaders(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json"
  };
}

export async function persistDonation(
  donation: DonationIntake,
  matches: RecipientMatch[],
  intakeMode: "ai" | "demo"
): Promise<PersistenceResult> {
  const config = getSupabaseConfig();

  if (!config) {
    return {
      persisted: false,
      storage: "demo",
      note: "Supabase is not configured; this result is temporary."
    };
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/donations`, {
      method: "POST",
      headers: {
        ...supabaseHeaders(config.key),
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        donation,
        matches,
        intake_mode: intakeMode
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Supabase insert failed: ${response.status} ${detail}`);
    }

    const rows = (await response.json()) as Array<{ id?: string }>;

    return {
      persisted: true,
      storage: "supabase",
      id: rows[0]?.id
    };
  } catch (error) {
    console.warn(
      "Supabase persistence fallback:",
      error instanceof Error ? error.message : error
    );

    return {
      persisted: false,
      storage: "demo",
      note: "Database save was unavailable, but the donation analysis still completed."
    };
  }
}

export async function getRecentDonations(limit = 5): Promise<PersistedDonation[]> {
  const config = getSupabaseConfig();
  if (!config) return [];

  const safeLimit = Math.min(Math.max(limit, 1), 10);

  try {
    const params = new URLSearchParams({
      select: "id,donation,matches,intake_mode,created_at",
      order: "created_at.desc",
      limit: String(safeLimit)
    });

    const response = await fetch(
      `${config.url}/rest/v1/donations?${params.toString()}`,
      {
        headers: supabaseHeaders(config.key),
        cache: "no-store"
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Supabase read failed: ${response.status} ${detail}`);
    }

    return (await response.json()) as PersistedDonation[];
  } catch (error) {
    console.warn(
      "Supabase recent-donations fallback:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}
