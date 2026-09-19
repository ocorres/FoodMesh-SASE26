import Link from "next/link";

const sampleLocations = [
  {
    name: "Community Pantry",
    details: "Fresh produce and pantry staples",
    time: "Today · 2:00–5:00 PM",
    access: "Step-free entrance · Accessible parking · Bus stop nearby"
  },
  {
    name: "Neighborhood Community Fridge",
    details: "Mixed groceries available while supplies last",
    time: "Open access · Today",
    access: "Ground-level access · Curbside pickup available"
  }
];

export default function FindFoodPage() {
  return (
    <main id="main" className="shell page-shell">
      <Link className="back-link" href="/">← FoodMesh home</Link>
      <p className="kicker">Find food</p>
      <h1>What is available near you?</h1>
      <p className="lede narrow">Enter a ZIP code. No account is required to browse.</p>

      <form className="search-card" action="#">
        <label htmlFor="zip">ZIP code</label>
        <div className="inline-form">
          <input id="zip" name="zip" inputMode="numeric" autoComplete="postal-code" placeholder="93955" />
          <button className="button" type="submit">Search</button>
        </div>
      </form>

      <section aria-labelledby="today-title">
        <div className="section-heading">
          <h2 id="today-title">Available today</h2>
          <button className="text-button" type="button">Print schedule</button>
        </div>
        <div className="location-list">
          {sampleLocations.map((location) => (
            <article className="location-card" key={location.name}>
              <h3>{location.name}</h3>
              <p>{location.details}</p>
              <p><strong>{location.time}</strong></p>
              <p className="access-line">♿ {location.access}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
