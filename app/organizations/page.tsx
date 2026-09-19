import Link from "next/link";
import OrganizationWorkflow from "@/components/OrganizationWorkflow";

export default function OrganizationsPage() {
  return (
    <main id="main" className="shell page-shell">
      <Link className="back-link" href="/">← FoodMesh home</Link>
      <p className="kicker">Community partners</p>
      <h1>Move more food with less friction.</h1>
      <p className="lede narrow">
        Food banks, churches, shelters, hotels, restaurants, schools, and employers can coordinate
        larger donations and community needs.
      </p>

      <div className="action-grid two-column">
        <article className="action-card">
          <p className="eyebrow">I have surplus food</p>
          <h2>Bulk donor</h2>
          <p>Post larger quantities, set pickup windows, and track community impact.</p>
          <Link className="button" href="/share">Start a donation</Link>
        </article>
        <article className="action-card">
          <p className="eyebrow">I serve my community</p>
          <h2>Receiving organization</h2>
          <p>Review routed donations, accept what fits, or decline so FoodMesh can reroute automatically.</p>
          <a className="button secondary" href="#routing-title">Open routing queue</a>
        </article>
      </div>

      <OrganizationWorkflow />
    </main>
  );
}
