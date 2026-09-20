"use client";

import { useEffect, useMemo, useState } from "react";

type ImpactData = {
  acceptedDonations: number;
  successfulMatches: number;
  estimatedServingsRedirected: number;
  estimatedMealEquivalents: number;
  estimatedValuePreserved: number;
  valueAssumptionPerServing: number;
  organizationsConnected: number;
  organizations: string[];
  recentAccepted: Array<{
    id: string;
    foodName: string;
    quantityText: string;
    organization: string;
    servings: number | null;
    createdAt: string;
  }>;
};

export default function ImpactDashboard() {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recognitionOptIn, setRecognitionOptIn] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/impact", { cache: "no-store" });
        if (!response.ok) return;
        setData(await response.json());
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }),
    []
  );

  if (loading) {
    return <p className="notice">Loading community impact…</p>;
  }

  if (!data) {
    return <p className="notice">Impact data is temporarily unavailable.</p>;
  }

  return (
    <>
      <section className="impact-metrics" aria-label="FoodMesh impact metrics">
        <article>
          <span className="impact-number">{data.estimatedServingsRedirected}</span>
          <strong>Estimated servings redirected</strong>
          <p>Based on accepted FoodMesh donations.</p>
        </article>
        <article>
          <span className="impact-number">{data.successfulMatches}</span>
          <strong>Successful matches</strong>
          <p>Accepted donor-to-organization routes.</p>
        </article>
        <article>
          <span className="impact-number">{data.estimatedMealEquivalents}</span>
          <strong>Estimated meal-equivalent servings</strong>
          <p>For the MVP, one recorded serving is shown as one meal-equivalent serving.</p>
        </article>
        <article>
          <span className="impact-number">{formatter.format(data.estimatedValuePreserved)}</span>
          <strong>Illustrative food value preserved</strong>
          <p>
            Demo estimate using ${data.valueAssumptionPerServing} per serving. This is not a tax,
            accounting, or donation valuation.
          </p>
        </article>
        <article>
          <span className="impact-number">{data.organizationsConnected}</span>
          <strong>Organizations connected</strong>
          <p>Unique community organizations that accepted routed food.</p>
        </article>
      </section>

      <section className="impact-panel" aria-labelledby="recognition-title">
        <p className="kicker">Recognition</p>
        <h2 id="recognition-title">Private by default.</h2>
        <p>
          FoodMesh does not publish donor or recipient identities by default. Businesses can opt
          into public recognition separately from the food-routing workflow.
        </p>
        <label className="recognition-toggle">
          <input
            type="checkbox"
            checked={recognitionOptIn}
            onChange={(event) => setRecognitionOptIn(event.target.checked)}
          />
          Show donor recognition in public impact summaries
        </label>
        <p className="field-help" role="status">
          {recognitionOptIn
            ? "Recognition preview enabled for this browser session only."
            : "Recognition remains private."}
        </p>
      </section>

      <section className="impact-panel" aria-labelledby="recent-impact-title">
        <p className="kicker">Recent impact</p>
        <h2 id="recent-impact-title">Accepted food routes</h2>

        {data.recentAccepted.length === 0 ? (
          <div className="empty-state">
            <h3>No accepted routes yet</h3>
            <p>Accept a routed donation from Organizations to populate this dashboard.</p>
          </div>
        ) : (
          <div className="impact-route-list">
            {data.recentAccepted.map((item) => (
              <article className="impact-route-card" key={item.id}>
                <div>
                  <h3>{item.foodName}</h3>
                  <p>{item.quantityText}</p>
                </div>
                <div>
                  <strong>{item.organization}</strong>
                  <p>{item.servings ?? "Unknown"} estimated servings</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="safety-note">
        This dashboard reports aggregate demo impact. It does not expose individual recipient
        identities or claim tax-deductible values.
      </p>
    </>
  );
}
