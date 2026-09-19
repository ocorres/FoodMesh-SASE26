import { NextResponse } from "next/server";
import { getRecentDonations, updateDonationRoute } from "@/lib/persistence";

export async function GET() {
  const donations = await getRecentDonations(10);
  return NextResponse.json({ donations });
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = typeof body.id === "string" ? body.id : "";
  const action = body.action === "accept" || body.action === "decline" ? body.action : null;

  if (!id || !action) {
    return NextResponse.json(
      { error: "A donation id and accept/decline action are required." },
      { status: 400 }
    );
  }

  const donation = await updateDonationRoute(id, action);

  if (!donation) {
    return NextResponse.json(
      { error: "Unable to update this routing request." },
      { status: 503 }
    );
  }

  return NextResponse.json({ donation });
}
