import type { DonationIntake, FoodCategory, RecipientMatch } from "./food";

type Organization = {
  id: string;
  name: string;
  distanceMiles: number;
  receivingWindow: string;
  capacityServings: number;
  accepts: FoodCategory[];
  refrigerated: boolean;
  accessibility: string[];
};

const organizations: Organization[] = [
  {
    id: "community-kitchen",
    name: "Community Kitchen",
    distanceMiles: 1.4,
    receivingWindow: "Today until 9:30 PM",
    capacityServings: 80,
    accepts: ["prepared_meal", "produce", "bakery", "beverage", "mixed"],
    refrigerated: true,
    accessibility: ["Step-free entrance", "Accessible parking", "Curbside handoff available"]
  },
  {
    id: "neighborhood-pantry",
    name: "Neighborhood Food Pantry",
    distanceMiles: 2.2,
    receivingWindow: "Today until 7:00 PM",
    capacityServings: 120,
    accepts: ["produce", "bakery", "dairy", "protein", "pantry", "beverage", "mixed"],
    refrigerated: true,
    accessibility: ["Wheelchair-accessible entrance", "Bus stop nearby"]
  },
  {
    id: "community-fridge",
    name: "Community Fridge Hub",
    distanceMiles: 0.8,
    receivingWindow: "Open access today",
    capacityServings: 30,
    accepts: ["produce", "bakery", "dairy", "pantry", "beverage", "mixed"],
    refrigerated: true,
    accessibility: ["Ground-level access", "No appointment required"]
  }
];

export function matchRecipients(donation: DonationIntake): RecipientMatch[] {
  return organizations
    .map((org) => {
      let score = 100;
      const reason: string[] = [];

      if (!org.accepts.includes(donation.category) && donation.category !== "other") {
        score -= 55;
      } else {
        reason.push("Accepts this food category");
      }

      if (
        donation.estimatedServings !== null &&
        donation.estimatedServings > org.capacityServings
      ) {
        score -= 35;
      } else {
        reason.push("Capacity fits the estimated donation");
      }

      if (
        (donation.storage === "refrigerated" || donation.storage === "frozen") &&
        !org.refrigerated
      ) {
        score -= 50;
      } else if (donation.storage === "refrigerated" || donation.storage === "frozen") {
        reason.push("Cold storage is available");
      }

      if (donation.urgency === "immediate" || donation.urgency === "same_day") {
        score -= Math.round(org.distanceMiles * 8);
        reason.push(`${org.distanceMiles.toFixed(1)} miles away for a time-sensitive pickup`);
      } else {
        score -= Math.round(org.distanceMiles * 4);
        reason.push(`${org.distanceMiles.toFixed(1)} miles away`);
      }

      if (org.accessibility.length > 0) {
        score += 4;
        reason.push("Accessibility information is available");
      }

      return {
        id: org.id,
        name: org.name,
        distanceMiles: org.distanceMiles,
        score: Math.max(0, score),
        reason,
        accessibility: org.accessibility,
        receivingWindow: org.receivingWindow
      };
    })
    .filter((match) => match.score >= 35)
    .sort((a, b) => b.score - a.score);
}
