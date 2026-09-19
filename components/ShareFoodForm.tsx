"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { DonationIntake, RecipientMatch } from "@/lib/food";

type IntakeResponse = {
  donation: DonationIntake;
  matches: RecipientMatch[];
  mode: "ai" | "demo";
  note?: string;
  persistence: {
    persisted: boolean;
    storage: "supabase" | "demo";
    id?: string;
    note?: string;
  };
};

type RecentDonation = {
  id: string;
  donation: DonationIntake;
  matches: RecipientMatch[];
  intake_mode: "ai" | "demo";
  created_at: string;
};

function labelValue(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ShareFoodForm() {
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [labelDate, setLabelDate] = useState("");
  const [labelDateType, setLabelDateType] = useState("unknown");
  const [result, setResult] = useState<IntakeResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  async function loadRecentDonations() {
    try {
      const response = await fetch("/api/donations", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setRecentDonations(Array.isArray(data.donations) ? data.donations : []);
    } catch {
      // Persistence is optional; the intake flow remains usable without it.
    }
  }

  useEffect(() => {
    void loadRecentDonations();
  }, []);

  useEffect(() => {
    if (result) {
      resultHeadingRef.current?.focus();
    }
  }, [result]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, deadline, labelDate, labelDateType })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to analyze the donation.");
      }

      setResult(data);
      if (data.persistence?.persisted) {
        void loadRecentDonations();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze the donation.");
    } finally {
      setLoading(false);
    }
  }

  const bestMatch = result?.matches[0];

  return (
    <>
      <form className="form-card" onSubmit={submit} aria-busy={loading}>
        <label htmlFor="description">Describe the food</label>
        <p className="field-help" id="description-help">
          Write naturally. Example: “We have 40 boxed sandwiches and fruit from a hotel conference.
          They need to be picked up tonight.”
        </p>
        <textarea
          id="description"
          name="description"
          rows={6}
          required
          minLength={4}
          aria-describedby="description-help"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What food do you have, and about how much?"
        />

        <label htmlFor="deadline">Pickup timing</label>
        <input
          id="deadline"
          name="deadline"
          type="text"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
          placeholder="Example: Tonight by 9 PM"
        />

        <label htmlFor="label-date-type">Date printed on the food, if present</label>
        <p className="field-help" id="label-date-help">
          Choose the wording printed on the package. “Best by,” “sell by,” and “use by” do not all
          mean the same thing, so FoodMesh keeps the original label type.
        </p>
        <select
          id="label-date-type"
          name="labelDateType"
          aria-describedby="label-date-help"
          value={labelDateType}
          onChange={(event) => setLabelDateType(event.target.value)}
        >
          <option value="unknown">No date / not sure</option>
          <option value="best_by">Best by</option>
          <option value="use_by">Use by</option>
          <option value="sell_by">Sell by</option>
          <option value="expiration">Expiration</option>
          <option value="prepared_on">Prepared on</option>
        </select>

        <label htmlFor="label-date">Printed date</label>
        <input
          id="label-date"
          name="labelDate"
          type="date"
          value={labelDate}
          onChange={(event) => setLabelDate(event.target.value)}
        />

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Analyzing donation…" : "Find the best match"}
        </button>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </form>

      {result && (
        <section className="results-panel" aria-live="polite" aria-labelledby="analysis-title">
          <div className="result-heading">
            <div>
              <p className="kicker">Donation interpreted</p>
              <h2 id="analysis-title" ref={resultHeadingRef} tabIndex={-1}>
                {result.donation.foodName}
              </h2>
            </div>
            <span className={result.mode === "ai" ? "mode-badge ai" : "mode-badge"}>
              {result.mode === "ai" ? "AI analyzed" : "Demo parser"}
            </span>
          </div>

          {result.note && <p className="notice">{result.note}</p>}

          <p
            className={result.persistence.persisted ? "storage-status saved" : "storage-status"}
            role="status"
          >
            {result.persistence.persisted
              ? "Saved to Supabase · this routing record will survive refresh."
              : result.persistence.note || "Temporary demo record · Supabase is not configured yet."}
          </p>

          <dl className="detail-grid">
            <div>
              <dt>Category</dt>
              <dd>{labelValue(result.donation.category)}</dd>
            </div>
            <div>
              <dt>Quantity</dt>
              <dd>{result.donation.quantityText}</dd>
            </div>
            <div>
              <dt>Urgency</dt>
              <dd>{labelValue(result.donation.urgency)}</dd>
            </div>
            <div>
              <dt>Storage</dt>
              <dd>{labelValue(result.donation.storage)}</dd>
            </div>
            <div>
              <dt>Pickup</dt>
              <dd>{result.donation.pickupSummary}</dd>
            </div>
            <div>
              <dt>Confidence</dt>
              <dd>{labelValue(result.donation.confidence)}</dd>
            </div>
            <div>
              <dt>Package date</dt>
              <dd>
                {result.donation.labelDate
                  ? `${labelValue(result.donation.labelDateType || "unknown")}: ${result.donation.labelDate}`
                  : "No printed date provided"}
              </dd>
            </div>
            <div>
              <dt>Date source</dt>
              <dd>{labelValue(result.donation.labelDateSource || "unknown")}</dd>
            </div>
          </dl>

          {bestMatch ? (
            <article className="best-match">
              <p className="eyebrow">Recommended recipient</p>
              <h3>{bestMatch.name}</h3>
              <p className="match-score">
                <strong>{bestMatch.score}/100 match</strong>
              </p>
              <p>
                <strong>{bestMatch.distanceMiles.toFixed(1)} miles away</strong> ·{" "}
                {bestMatch.receivingWindow}
              </p>

              <h4>Why this match</h4>
              <ul>
                {bestMatch.reason.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>

              <h4>Score breakdown</h4>
              <dl className="score-grid">
                {Object.entries(bestMatch.scoreBreakdown).map(([key, value]) => (
                  <div key={key}>
                    <dt>{labelValue(key)}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              <h4>Accessibility</h4>
              <ul>
                {bestMatch.accessibility.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : (
            <p className="notice">
              No safe demo match met the current routing constraints. The next version will offer a
              fallback community-resource route.
            </p>
          )}

          {result.matches.length > 1 && (
            <section className="alternatives" aria-labelledby="alternatives-title">
              <h3 id="alternatives-title">Other eligible recipients</h3>
              <div className="alternative-grid">
                {result.matches.slice(1, 3).map((match) => (
                  <article className="alternative-card" key={match.id}>
                    <div>
                      <h4>{match.name}</h4>
                      <p>{match.distanceMiles.toFixed(1)} miles · {match.receivingWindow}</p>
                    </div>
                    <strong>{match.score}/100</strong>
                  </article>
                ))}
              </div>
            </section>
          )}

          <p className="safety-note">
            FoodMesh preserves the date wording printed on the food rather than treating every
            package date as a safety expiration. FoodMesh does not use AI to make food-safety
            guarantees. Donors and recipient organizations remain responsible for following
            applicable food handling requirements.
          </p>
        </section>
      )}

      {recentDonations.length > 0 && (
        <section className="recent-donations" aria-labelledby="recent-donations-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Persisted demo data</p>
              <h2 id="recent-donations-title">Recent routed donations</h2>
            </div>
          </div>
          <div className="recent-donation-list">
            {recentDonations.map((item) => (
              <article className="recent-donation-card" key={item.id}>
                <div>
                  <h3>{item.donation.foodName}</h3>
                  <p>
                    {item.donation.quantityText} · {labelValue(item.donation.category)}
                  </p>
                  <p className="field-help">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="recent-route">
                  <strong>{item.matches[0]?.name || "No eligible recipient"}</strong>
                  <span>{item.matches[0] ? `${item.matches[0].score}/100 match` : "Review needed"}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
