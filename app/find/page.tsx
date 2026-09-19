import Link from "next/link";
import FindFoodClient from "@/components/FindFoodClient";

export default function FindFoodPage() {
  return (
    <main id="main" className="shell page-shell">
      <Link className="back-link" href="/">← FoodMesh home</Link>
      <p className="kicker">Find food</p>
      <h1>What is available near you?</h1>
      <p className="lede narrow">
        Search by ZIP code, filter for dietary or accessibility needs, and print a local pickup
        schedule. No account is required to browse.
      </p>

      <FindFoodClient />
    </main>
  );
}
