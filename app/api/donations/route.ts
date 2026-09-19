import { NextResponse } from "next/server";
import { getRecentDonations } from "@/lib/persistence";

export async function GET() {
  const donations = await getRecentDonations(5);

  return NextResponse.json({
    donations,
    storage: donations.length > 0 ? "supabase" : "demo"
  });
}
