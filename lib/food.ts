export type FoodCategory =
  | "prepared_meal"
  | "produce"
  | "bakery"
  | "dairy"
  | "protein"
  | "pantry"
  | "beverage"
  | "mixed"
  | "other";

export type DateLabelType = "best_by" | "use_by" | "sell_by" | "expiration" | "prepared_on" | "unknown";
export type DateSource = "manual" | "text_ai" | "photo_ai" | "unknown";

export type DonationIntake = {
  foodName: string;
  category: FoodCategory;
  quantityText: string;
  estimatedServings: number | null;
  urgency: "immediate" | "same_day" | "next_day" | "flexible";
  storage: "ambient" | "refrigerated" | "frozen" | "unknown";
  dietaryNotes: string[];
  allergenNotes: string[];
  pickupSummary: string;
  confidence: "low" | "medium" | "high";
  labelDate?: string | null;
  labelDateType?: DateLabelType;
  labelDateSource?: DateSource;
  dateNeedsConfirmation?: boolean;
};

export type RecipientMatch = {
  id: string;
  name: string;
  distanceMiles: number;
  score: number;
  reason: string[];
  accessibility: string[];
  receivingWindow: string;
};
