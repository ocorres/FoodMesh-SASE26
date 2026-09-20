import { NextResponse } from "next/server";
import { getRecentDonations } from "@/lib/persistence";

export async function GET() {
  const donations = await getRecentDonations(10);
  const accepted = donations.filter((item) => item.route_status === "accepted");

  const servings = accepted.reduce(
    (sum, item) => sum + (item.impact_servings || item.donation.estimatedServings || 0),
    0
  );

  const organizations = Array.from(
    new Set(
      accepted
        .map((item) => item.accepted_by)
        .filter((name): name is string => Boolean(name))
    )
  );

  const illustrativeValuePerServing = 4;

  return NextResponse.json({
    acceptedDonations: accepted.length,
    successfulMatches: accepted.length,
    estimatedServingsRedirected: servings,
    estimatedMealEquivalents: servings,
    estimatedValuePreserved: servings * illustrativeValuePerServing,
    valueAssumptionPerServing: illustrativeValuePerServing,
    organizationsConnected: organizations.length,
    organizations,
    recentAccepted: accepted.slice(0, 5).map((item) => ({
      id: item.id,
      foodName: item.donation.foodName,
      quantityText: item.donation.quantityText,
      organization: item.accepted_by || "Community organization",
      servings: item.impact_servings || item.donation.estimatedServings || null,
      createdAt: item.created_at
    }))
  });
}
