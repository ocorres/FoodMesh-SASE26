import Link from "next/link";
import ImpactDashboard from "@/components/ImpactDashboard";

export default function ImpactPage() {
  return (
    <main id="main" className="shell page-shell">
      <Link className="back-link" href="/">← FoodMesh home</Link>
      <p className="kicker">Community impact</p>
      <h1>See what FoodMesh moved.</h1>
      <p className="lede narrow">
        Aggregate impact from accepted donation routes. Recipient privacy stays protected.
      </p>
      <ImpactDashboard />
    </main>
  );
}
