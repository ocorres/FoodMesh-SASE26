import Link from "next/link";

const actions = [
  {
    href: "/find",
    eyebrow: "For neighbors",
    title: "Find Food",
    text: "See food available near you without creating an account.",
    cta: "Find food near me"
  },
  {
    href: "/share",
    eyebrow: "For donors",
    title: "Share Food",
    text: "Post surplus food quickly and help route it before it becomes waste.",
    cta: "Share food"
  },
  {
    href: "/organizations",
    eyebrow: "For community partners",
    title: "Organizations",
    text: "Receive, coordinate, or contribute larger food donations.",
    cta: "Organization tools"
  }
];

export default function Home() {
  return (
    <main id="main">
      <section className="hero shell" aria-labelledby="hero-title">
        <nav className="topbar" aria-label="Primary">
          <Link className="brand" href="/">FoodMesh</Link>
          <span className="tag">Food shared with dignity.</span>
        </nav>

        <div className="hero-copy">
          <p className="kicker">Hyperlocal food resilience</p>
          <h1 id="hero-title">Good food should reach people, not waste bins.</h1>
          <p className="lede">
            FoodMesh helps households, businesses, and community organizations route surplus food
            to nearby people who can use it.
          </p>
        </div>

        <div className="action-grid" aria-label="Choose how you want to use FoodMesh">
          {actions.map((action) => (
            <article className="action-card" key={action.href}>
              <p className="eyebrow">{action.eyebrow}</p>
              <h2>{action.title}</h2>
              <p>{action.text}</p>
              <Link className="button" href={action.href}>{action.cta}</Link>
            </article>
          ))}
        </div>

        <section className="principles" aria-labelledby="principles-title">
          <div>
            <p className="kicker">Built for access</p>
            <h2 id="principles-title">Simple enough for a library computer. Useful enough for a hotel.</h2>
          </div>
          <ul>
            <li>No account required to browse available food.</li>
            <li>Designed for keyboard, screen reader, and zoom users.</li>
            <li>Physical accessibility details are shown for pickup locations.</li>
            <li>Printable schedules support people with limited internet access.</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
