import Link from "next/link";
import ShareFoodForm from "@/components/ShareFoodForm";

export default function ShareFoodPage() {
  return (
    <main id="main" className="shell page-shell">
      <Link className="back-link" href="/">← FoodMesh home</Link>
      <p className="kicker">Share food</p>
      <h1>Tell us what you have.</h1>
      <p className="lede narrow">
        Describe surplus food in your own words. FoodMesh structures the donation and recommends a
        nearby community recipient.
      </p>
      <ShareFoodForm />
    </main>
  );
}
