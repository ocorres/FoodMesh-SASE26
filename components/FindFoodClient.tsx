"use client";

import { FormEvent, useMemo, useState } from "react";

type Listing = {
  id: string;
  zip: string;
  name: string;
  food: string;
  time: string;
  distanceMiles: number;
  dietary: string[];
  accessibility: string[];
  curbside: boolean;
  stepFree: boolean;
};

const listings: Listing[] = [
  {
    id: "pantry-93955",
    zip: "93955",
    name: "Community Pantry",
    food: "Fresh produce, rice, beans, and pantry staples",
    time: "Today · 2:00–5:00 PM",
    distanceMiles: 1.2,
    dietary: ["vegetarian", "vegan", "gluten-free"],
    accessibility: ["Step-free entrance", "Accessible parking", "Bus stop nearby"],
    curbside: false,
    stepFree: true
  },
  {
    id: "fridge-93955",
    zip: "93955",
    name: "Neighborhood Community Fridge",
    food: "Mixed groceries available while supplies last",
    time: "Open access · Today",
    distanceMiles: 0.8,
    dietary: ["vegetarian"],
    accessibility: ["Ground-level access", "Curbside pickup available"],
    curbside: true,
    stepFree: true
  },
  {
    id: "kitchen-93940",
    zip: "93940",
    name: "Community Kitchen",
    food: "Prepared meals, fruit, and bottled drinks",
    time: "Today · 4:00–7:30 PM",
    distanceMiles: 3.4,
    dietary: ["vegetarian"],
    accessibility: ["Step-free entrance", "Accessible parking"],
    curbside: true,
    stepFree: true
  },
  {
    id: "center-93933",
    zip: "93933",
    name: "Family Resource Center",
    food: "Bread, shelf-stable groceries, and produce boxes",
    time: "Tomorrow · 10:00 AM–1:00 PM",
    distanceMiles: 5.1,
    dietary: ["vegetarian", "vegan"],
    accessibility: ["Wheelchair-accessible entrance", "Seating while waiting"],
    curbside: false,
    stepFree: true
  }
];

export default function FindFoodClient() {
  const [zipInput, setZipInput] = useState("93955");
  const [activeZip, setActiveZip] = useState("93955");
  const [dietary, setDietary] = useState("all");
  const [stepFreeOnly, setStepFreeOnly] = useState(false);
  const [curbsideOnly, setCurbsideOnly] = useState(false);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveZip(zipInput.trim());
  }

  const results = useMemo(() => {
    return listings
      .filter((listing) => !activeZip || listing.zip === activeZip)
      .filter((listing) => dietary === "all" || listing.dietary.includes(dietary))
      .filter((listing) => !stepFreeOnly || listing.stepFree)
      .filter((listing) => !curbsideOnly || listing.curbside)
      .sort((a, b) => a.distanceMiles - b.distanceMiles);
  }, [activeZip, dietary, stepFreeOnly, curbsideOnly]);

  return (
    <>
      <form className="search-card no-print" onSubmit={submitSearch}>
        <label htmlFor="zip">ZIP code</label>
        <div className="inline-form">
          <input
            id="zip"
            name="zip"
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[0-9]{5}"
            maxLength={5}
            value={zipInput}
            onChange={(event) => setZipInput(event.target.value)}
            placeholder="93955"
            aria-describedby="zip-help"
          />
          <button className="button" type="submit">Search</button>
        </div>
        <p className="field-help" id="zip-help">
          Demo data is available for 93955, 93940, and 93933.
        </p>

        <fieldset className="filter-fieldset">
          <legend>Filter results</legend>

          <label htmlFor="dietary">Dietary option</label>
          <select
            id="dietary"
            value={dietary}
            onChange={(event) => setDietary(event.target.value)}
          >
            <option value="all">Any dietary option</option>
            <option value="vegetarian">Vegetarian-friendly</option>
            <option value="vegan">Vegan-friendly</option>
            <option value="gluten-free">Gluten-free options</option>
          </select>

          <div className="check-row">
            <label>
              <input
                type="checkbox"
                checked={stepFreeOnly}
                onChange={(event) => setStepFreeOnly(event.target.checked)}
              />
              Step-free / wheelchair-accessible pickup
            </label>

            <label>
              <input
                type="checkbox"
                checked={curbsideOnly}
                onChange={(event) => setCurbsideOnly(event.target.checked)}
              />
              Curbside pickup available
            </label>
          </div>
        </fieldset>
      </form>

      <section aria-labelledby="today-title">
        <div className="section-heading">
          <div>
            <p className="kicker">Local schedule</p>
            <h2 id="today-title">
              {activeZip ? `Food near ${activeZip}` : "Available food"}
            </h2>
          </div>
          <button
            className="text-button no-print"
            type="button"
            onClick={() => window.print()}
          >
            Print schedule
          </button>
        </div>

        <p className="results-count" aria-live="polite">
          {results.length} {results.length === 1 ? "location" : "locations"} found
        </p>

        {results.length > 0 ? (
          <div className="location-list">
            {results.map((listing) => (
              <article className="location-card" key={listing.id}>
                <div className="location-card-header">
                  <div>
                    <h3>{listing.name}</h3>
                    <p>{listing.food}</p>
                  </div>
                  <span className="distance-badge">
                    {listing.distanceMiles.toFixed(1)} mi
                  </span>
                </div>

                <p><strong>{listing.time}</strong></p>

                {listing.dietary.length > 0 && (
                  <p>
                    <strong>Dietary options:</strong>{" "}
                    {listing.dietary.join(", ")}
                  </p>
                )}

                <div className="access-block">
                  <strong>Accessibility</strong>
                  <ul>
                    {listing.accessibility.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <p className="verification-note">
                  Accessibility information provided by this demo location.
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state" role="status">
            <h3>No matching demo listings</h3>
            <p>
              Try another ZIP code or remove one of the filters. FoodMesh should always
              provide a clear text result rather than requiring a map.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
