"use client";

import { useEffect, useMemo, useState } from "react";
import type { DonationIntake, RecipientMatch } from "@/lib/food";

type RoutedDonation = {
  id: string;
  donation: DonationIntake;
  matches: RecipientMatch[];
  intake_mode: "ai" | "demo";
  route_status?: "pending" | "accepted" | "unmatched";
  current_match_index?: number;
  accepted_by?: string | null;
  impact_servings?: number | null;
  created_at: string;
};

export default function OrganizationWorkflow() {
  const [donations, setDonations] = useState<RoutedDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  async function loadDonations() {
    try {
      const response = await fetch("/api/organizations", { cache: "no-store" });
      const data = await response.json();
      setDonations(Array.isArray(data.donations) ? data.donations : []);
    } catch {
      setMessage("Unable to load organization routing data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDonations();
  }, []);

  async function act(id: string, action: "accept" | "decline") {
    setBusyId(id);
    setMessage("");

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update routing.");
      }

      setMessage(
        action === "accept"
          ? "Donation accepted. Impact was recorded."
          : "Donation declined and rerouted to the next eligible organization."
      );
      await loadDonations();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update routing.");
    } finally {
      setBusyId("");
    }
  }

  const impact = useMemo(() => {
    const accepted = donations.filter((item) => item.route_status === "accepted");
    return {
      accepted: accepted.length,
      servings: accepted.reduce((sum, item) => sum + (item.impact_servings || 0), 0)
    };
  }, [donations]);

  if (loading) {
    return <p className="notice">Loading organization routing queue…</p>;
  }

  return (
    <section className="organization-workflow" aria-labelledby="routing-title">
      <div className="section-heading">
        <div>
          <p className="kicker">Partner workflow</p>
          <h2 id="routing-title">Incoming donation routing</h2>
        </div>
      </div>

      <div className="impact-grid" aria-label="Organization impact summary">
        <article>
          <strong>{impact.accepted}</strong>
          <span>Accepted donations</span>
        </article>
        <article>
          <strong>{impact.servings}</strong>
          <span>Estimated servings redirected</span>
        </article>
      </div>

      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}

      {donations.length === 0 ? (
        <div className="empty-state">
          <h3>No routed donations yet</h3>
          <p>Create a donation from Share Food to populate this partner queue.</p>
        </div>
      ) : (
        <div className="routing-list">
          {donations.map((item) => {
            const index = item.current_match_index ?? 0;
            const activeMatch = item.matches[index];
            const status = item.route_status || "pending";

            return (
              <article className="routing-card" key={item.id}>
                <div className="routing-card-head">
                  <div>
                    <p className="eyebrow">{status.replaceAll("_", " ")}</p>
                    <h3>{item.donation.foodName}</h3>
                    <p>
                      {item.donation.quantityText} · {item.donation.pickupSummary}
                    </p>
                  </div>
                  <span className={status === "accepted" ? "route-badge accepted" : "route-badge"}>
                    {status === "accepted"
                      ? "Accepted"
                      : status === "unmatched"
                        ? "Needs manual help"
                        : "Awaiting response"}
                  </span>
                </div>

                {activeMatch ? (
                  <div className="route-target">
                    <p className="field-help">Current recipient</p>
                    <strong>{activeMatch.name}</strong>
                    <span>
                      {activeMatch.score}/100 match · {activeMatch.distanceMiles.toFixed(1)} miles
                    </span>
                  </div>
                ) : (
                  <p className="notice">
                    No additional eligible recipient remains in the current routing list.
                  </p>
                )}

                {status === "pending" && activeMatch && (
                  <div className="routing-actions">
                    <button
                      className="button"
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => void act(item.id, "accept")}
                    >
                      {busyId === item.id ? "Updating…" : "Accept donation"}
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => void act(item.id, "decline")}
                    >
                      Decline & reroute
                    </button>
                  </div>
                )}

                {status === "accepted" && (
                  <p className="impact-line">
                    Routed to <strong>{item.accepted_by || "recipient organization"}</strong>
                    {item.impact_servings
                      ? ` · ${item.impact_servings} estimated servings recorded`
                      : ""}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
