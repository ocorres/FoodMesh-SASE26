# FoodMesh

FoodMesh is a hyperlocal food-sharing and food-resilience web app that helps households and businesses make surplus food visible, matches donations to nearby community organizations, and lets people browse nearby food availability before usable food becomes waste.

## What the MVP does

- **Find Food:** browse nearby demo food availability by ZIP code without creating an account
- **Share Food:** describe surplus food in natural language and let AI structure the intake
- **Smart Routing:** deterministically rank eligible recipient organizations by category, capacity, urgency, distance, storage, dietary-routing metadata, and accessibility
- **Organization Workflow:** recipient organizations can accept a donation or decline it so FoodMesh reroutes to the next eligible recipient
- **Persistence:** donation and routing state are stored in Supabase
- **Accessibility:** keyboard-friendly controls, visible focus states, screen-reader-oriented semantics, text-first location information, printable schedules, and responsive reflow
- **Package-Date Capture:** preserves whether a label says best by, use by, sell by, expiration, or prepared on

## Product direction

FoodMesh is designed as a local coordination layer, not a delivery service. The current hackathon MVP routes donations through community organizations and lets people browse nearby food resources. The broader concept can extend to trusted neighbor-to-neighbor pickup while keeping coordination local.

## Architecture

```mermaid
flowchart LR
    A[Donor or Organization] --> B[Next.js UI]
    B --> C[/api/intake]
    C --> D[OpenAI Responses API]
    D --> C
    C --> E[Deterministic Matching Engine]
    E --> F[Ranked Recipient Matches]
    C --> G[(Supabase Postgres)]
    G --> H[Organization Routing Queue]
    H --> I[Accept or Decline]
    I --> G
    J[Find Food] --> K[Text-first Local Listings]
```

### Design boundary

**AI interprets. Rules decide.**

AI converts messy human input into structured donation data. Deterministic software handles routing constraints and scoring. FoodMesh does not delegate food-safety guarantees or final routing logic to the language model.

## Technology

- Next.js 16
- React
- TypeScript
- OpenAI Responses API
- Supabase Postgres + REST/Data API
- Plain CSS

## Local development

Create `.env.local`:

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna

SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
```

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. If the initial schema was already installed before the organization workflow was added, also run `supabase/organization_workflow.sql`.
4. Add the project URL and publishable key to `.env.local`.

## Demo flow

1. Open **Share Food**.
2. Enter a donation such as: `20 refrigerated boxed sandwiches that need pickup tonight`.
3. Confirm the result says **AI analyzed**.
4. Review the recommended recipient, 0-100 match score, score breakdown, and alternatives.
5. Confirm the record is saved to Supabase.
6. Open **Organizations**.
7. Decline once to demonstrate rerouting, then accept the next match.
8. Confirm accepted donation and estimated servings are reflected in the impact summary.
9. Open **Find Food** and demonstrate ZIP, dietary, accessibility, and print filters.

## Accessibility

FoodMesh is designed around an accessibility baseline that includes:

- skip link
- visible keyboard focus
- semantic labels and landmarks
- dynamic status announcements
- minimum 44px interactive targets
- responsive 200%/400% zoom reflow targets
- no map-only critical information
- physical accessibility details as text
- reduced-motion support
- printable food schedules

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for the manual MVP audit checklist.

This is not a claim of formal WCAG certification.

## Demo data and privacy

The hackathon build uses demo organization and location records. Recipient-facing browsing does not require an account. The current demo database should not be used to store sensitive personal recipient information.

## Current status

Completed and locally verified:

- #1 Scaffold FoodMesh
- #2 AI-assisted donation intake
- #3 Smart matching engine
- #4 Find Food experience
- #5 Supabase persistence
- #6 Organization/business workflow
- #7 Accessibility audit
- #8 Impact dashboard
- #9 Demo hardening
- Live Vercel deployment
- Final pitch slides
- Final pitch/demo recording

Remaining:

- #10 Add final public video/slide links and submit the Devpost entry

## License

MIT
