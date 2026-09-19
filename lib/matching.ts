import type {
  DonationIntake,
  FoodCategory,
  MatchScoreBreakdown,
  RecipientMatch
} from "./food";

type ReceivingAvailability = "open_now" | "same_day" | "next_day" | "flexible";

type Organization = {
  id: string;
  name: string;
  distanceMiles: number;
  receivingWindow: string;
  receivingAvailability: ReceivingAvailability;
  capacityServings: number;
  accepts: FoodCategory[];
  refrigerated: boolean;
  frozen: boolean;
  dietaryRouting: string[];
  accessibility: string[];
};

const organizations: Organization[] = [
  {
    id: "community-kitchen",
    name: "Community Kitchen",
    distanceMiles: 1.4,
    receivingWindow: "Today until 9:30 PM",
    receivingAvailability: "open_now",
    capacityServings: 80,
    accepts: ["prepared_meal", "produce", "bakery", "beverage", "mixed"],
    refrigerated: true,
    frozen: false,
    dietaryRouting: ["vegetarian", "vegan", "gluten-free"],
    accessibility: ["Step-free entrance", "Accessible parking", "Curbside handoff available"]
  },
  {
    id: "neighborhood-pantry",
    name: "Neighborhood Food Pantry",
    distanceMiles: 2.2,
    receivingWindow: "Today until 7:00 PM",
    receivingAvailability: "same_day",
    capacityServings: 120,
    accepts: ["produce", "bakery", "dairy", "protein", "pantry", "beverage", "mixed"],
    refrigerated: true,
    frozen: true,
    dietaryRouting: ["vegetarian", "vegan", "gluten-free"],
    accessibility: ["Wheelchair-accessible entrance", "Bus stop nearby"]
  },
  {
    id: "community-fridge",
    name: "Community Fridge Hub",
    distanceMiles: 0.8,
    receivingWindow: "Open access today",
    receivingAvailability: "open_now",
    capacityServings: 30,
    accepts: ["produce", "bakery", "dairy", "pantry", "beverage", "mixed"],
    refrigerated: true,
    frozen: false,
    dietaryRouting: ["vegetarian", "vegan", "gluten-free"],
    accessibility: ["Ground-level access", "No appointment required"]
  },
  {
    id: "shelter-meal-program",
    name: "Shelter Meal Program",
    distanceMiles: 3.1,
    receivingWindow: "Today until 10:00 PM",
    receivingAvailability: "same_day",
    capacityServings: 200,
    accepts: ["prepared_meal", "produce", "bakery", "protein", "beverage", "mixed"],
    refrigerated: true,
    frozen: true,
    dietaryRouting: ["vegetarian"],
    accessibility: ["Step-free receiving entrance", "Curbside handoff available"]
  }
];

function normalizedDietaryNotes(notes: string[]) {
  return notes.map((note) => note.trim().toLowerCase()).filter(Boolean);
}

function passesHardConstraints(org: Organization, donation: DonationIntake) {
  if (donation.category !== "other" && !org.accepts.includes(donation.category)) return false;

  if (
    donation.estimatedServings !== null &&
    donation.estimatedServings > org.capacityServings
  ) return false;

  if (donation.storage === "refrigerated" && !org.refrigerated) return false;
  if (donation.storage === "frozen" && !org.frozen) return false;

  if (
    donation.urgency === "immediate" &&
    org.receivingAvailability !== "open_now"
  ) return false;

  if (
    donation.urgency === "same_day" &&
    !["open_now", "same_day"].includes(org.receivingAvailability)
  ) return false;

  return true;
}

function urgencyScore(org: Organization, donation: DonationIntake) {
  if (donation.urgency === "immediate") return 20;
  if (donation.urgency === "same_day") {
    return org.receivingAvailability === "same_day" ? 20 : 18;
  }
  if (donation.urgency === "next_day") {
    if (org.receivingAvailability === "next_day") return 20;
    if (org.receivingAvailability === "flexible") return 18;
    return 17;
  }
  return org.receivingAvailability === "flexible" ? 20 : 16;
}

function dietaryScore(org: Organization, donation: DonationIntake) {
  const notes = normalizedDietaryNotes(donation.dietaryNotes);
  if (notes.length === 0) return 5;

  const matched = notes.filter((note) =>
    org.dietaryRouting.some(
      (supported) => note.includes(supported) || supported.includes(note)
    )
  ).length;

  return Math.round((matched / notes.length) * 10);
}

function scoreOrganization(org: Organization, donation: DonationIntake): RecipientMatch {
  const category = 20;
  const distance = Math.max(0, Math.round(30 - org.distanceMiles * 4));

  const capacity =
    donation.estimatedServings === null
      ? 10
      : Math.round(
          10 +
            Math.min(
              1,
              donation.estimatedServings / Math.max(1, org.capacityServings)
            ) *
              10
        );

  const urgency = urgencyScore(org, donation);
  const storage =
    donation.storage === "refrigerated" || donation.storage === "frozen" ? 10 : 7;
  const dietary = dietaryScore(org, donation);
  const accessibility = org.accessibility.length >= 2 ? 5 : 2;

  const scoreBreakdown: MatchScoreBreakdown = {
    category,
    distance,
    capacity,
    urgency,
    storage,
    dietary,
    accessibility
  };

  const score = Math.min(
    100,
    Object.values(scoreBreakdown).reduce((sum, value) => sum + value, 0)
  );

  const reason = [
    "Passes all hard routing constraints",
    "Accepts this food category",
    `Capacity supports the full donation (${org.capacityServings} serving limit)`,
    `${org.distanceMiles.toFixed(1)} miles away`,
    `Receiving window fits the ${donation.urgency.replaceAll("_", " ")} urgency`,
    "Accessibility and handoff information is available"
  ];

  if (donation.storage === "refrigerated") {
    reason.push("Refrigerated storage is available");
  } else if (donation.storage === "frozen") {
    reason.push("Frozen storage is available");
  }

  const dietaryNotes = normalizedDietaryNotes(donation.dietaryNotes);
  if (dietaryNotes.length > 0 && dietary > 0) {
    reason.push("Can route at least some of the identified dietary requirements");
  }

  return {
    id: org.id,
    name: org.name,
    distanceMiles: org.distanceMiles,
    score,
    scoreBreakdown,
    reason,
    accessibility: org.accessibility,
    receivingWindow: org.receivingWindow
  };
}

export function matchRecipients(donation: DonationIntake): RecipientMatch[] {
  return organizations
    .filter((org) => passesHardConstraints(org, donation))
    .map((org) => scoreOrganization(org, donation))
    .sort((a, b) => b.score - a.score || a.distanceMiles - b.distanceMiles);
}
