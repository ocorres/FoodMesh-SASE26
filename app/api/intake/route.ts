import { NextResponse } from "next/server";
import type { DateLabelType, DonationIntake, FoodCategory } from "@/lib/food";
import { matchRecipients } from "@/lib/matching";

const categories: FoodCategory[] = [
  "prepared_meal",
  "produce",
  "bakery",
  "dairy",
  "protein",
  "pantry",
  "beverage",
  "mixed",
  "other"
];

function fallbackParse(
  description: string,
  deadline: string,
  labelDate: string,
  labelDateType: DateLabelType
): DonationIntake {
  const text = `${description} ${deadline}`.toLowerCase();

  let category: FoodCategory = "other";
  if (/sandwich|meal|cater|leftover|boxed lunch|prepared/.test(text)) category = "prepared_meal";
  else if (/fruit|vegetable|produce|apple|banana|orange/.test(text)) category = "produce";
  else if (/bread|pastr|bakery|bagel|muffin/.test(text)) category = "bakery";
  else if (/milk|cheese|yogurt|dairy/.test(text)) category = "dairy";
  else if (/meat|chicken|beef|fish|protein/.test(text)) category = "protein";
  else if (/can|rice|beans|pasta|pantry|dry goods/.test(text)) category = "pantry";
  else if (/drink|juice|water|beverage/.test(text)) category = "beverage";
  else if (/mixed|assorted|variety/.test(text)) category = "mixed";

  const quantityMatch = text.match(/\b(\d{1,4})\b/);
  const quantity = quantityMatch ? Number(quantityMatch[1]) : null;

  const urgency =
    /asap|immediate|right now|within an hour/.test(text)
      ? "immediate"
      : /tonight|today|same day|this evening/.test(text)
        ? "same_day"
        : /tomorrow|next day/.test(text)
          ? "next_day"
          : "flexible";

  const storage =
    /frozen|freezer/.test(text)
      ? "frozen"
      : /refrigerat|cold|chilled/.test(text)
        ? "refrigerated"
        : "unknown";

  return {
    foodName: description.trim().slice(0, 80) || "Surplus food",
    category,
    quantityText: quantity ? `About ${quantity}` : "Quantity not specified",
    estimatedServings: quantity,
    urgency,
    storage,
    dietaryNotes: [],
    allergenNotes: [],
    pickupSummary: deadline.trim() || "Pickup timing not specified",
    confidence: "low",
    labelDate: labelDate || null,
    labelDateType,
    labelDateSource: labelDate ? "manual" : "unknown",
    dateNeedsConfirmation: false
  };
}

async function parseWithOpenAI(description: string, deadline: string): Promise<DonationIntake> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions:
        "You structure surplus-food donation descriptions for a community food-routing app. Do not invent food-safety claims. If information is missing, use unknown/empty values rather than guessing. Quantity estimates should only be made when reasonably supported by the user's words.",
      input: `Donation description: ${description}\nPickup timing: ${deadline || "not specified"}`,
      text: {
        format: {
          type: "json_schema",
          name: "food_donation_intake",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              foodName: { type: "string" },
              category: { type: "string", enum: categories },
              quantityText: { type: "string" },
              estimatedServings: { type: ["number", "null"] },
              urgency: {
                type: "string",
                enum: ["immediate", "same_day", "next_day", "flexible"]
              },
              storage: {
                type: "string",
                enum: ["ambient", "refrigerated", "frozen", "unknown"]
              },
              dietaryNotes: { type: "array", items: { type: "string" } },
              allergenNotes: { type: "array", items: { type: "string" } },
              pickupSummary: { type: "string" },
              confidence: { type: "string", enum: ["low", "medium", "high"] }
            },
            required: [
              "foodName",
              "category",
              "quantityText",
              "estimatedServings",
              "urgency",
              "storage",
              "dietaryNotes",
              "allergenNotes",
              "pickupSummary",
              "confidence"
            ]
          }
        }
      }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${detail}`);
  }

  const payload = await response.json();
  const outputText = payload.output_text;

  if (!outputText) {
    throw new Error("OpenAI returned no structured output");
  }

  return JSON.parse(outputText) as DonationIntake;
}

export async function POST(request: Request) {
  const body = await request.json();
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const deadline = typeof body.deadline === "string" ? body.deadline.trim() : "";
  const labelDate = typeof body.labelDate === "string" ? body.labelDate.trim() : "";
  const allowedDateTypes: DateLabelType[] = [
    "best_by",
    "use_by",
    "sell_by",
    "expiration",
    "prepared_on",
    "unknown"
  ];
  const labelDateType: DateLabelType =
    typeof body.labelDateType === "string" && allowedDateTypes.includes(body.labelDateType as DateLabelType)
      ? (body.labelDateType as DateLabelType)
      : "unknown";

  if (description.length < 4) {
    return NextResponse.json(
      { error: "Please describe the surplus food in a little more detail." },
      { status: 400 }
    );
  }

  let donation: DonationIntake;
  let mode: "ai" | "demo";
  let note: string | undefined;

  if (!process.env.OPENAI_API_KEY) {
    donation = fallbackParse(description, deadline, labelDate, labelDateType);
    mode = "demo";
    note = "Demo parser active. Add an OpenAI API key to enable live AI analysis.";
  } else {
    try {
      donation = await parseWithOpenAI(description, deadline);
      mode = "ai";
    } catch (error) {
      donation = fallbackParse(description, deadline, labelDate, labelDateType);
      mode = "demo";
      note = "AI analysis was temporarily unavailable, so FoodMesh used its local fallback parser.";
      console.warn("OpenAI intake fallback:", error instanceof Error ? error.message : error);
    }
  }

  const matches = matchRecipients(donation);

  return NextResponse.json({
    donation,
    matches,
    mode,
    note
  });
}
