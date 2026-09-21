# FoodMesh Submission Package

## One-line description

FoodMesh is a hyperlocal food-sharing network that uses AI-assisted intake and explainable rules to help households, businesses, and community organizations coordinate nearby surplus food before it becomes waste.

## Short project description

FoodMesh addresses a local coordination failure: usable food can exist near people who could use it, while donors, community organizations, and neighbors still lack a simple way to see what is available and coordinate around it.

A donor describes surplus food in plain language. OpenAI structures the intake, while deterministic routing logic evaluates category compatibility, quantity, recipient capacity, urgency, distance, storage requirements, dietary-routing metadata, and accessibility. FoodMesh then recommends an eligible community organization and explains why it was selected.

If an organization declines, the donation can be rerouted to the next eligible match. Supabase persists donation state, routing history, and impact data. A separate Find Food experience lets people browse nearby food availability without requiring an account and includes text-based accessibility information and printable schedules.

FoodMesh is a coordination layer, not a delivery service. The current MVP routes donations through community organizations; the broader concept is designed to extend to trusted neighbor-to-neighbor pickup as the network grows.

## Why AI is useful here

The AI component is deliberately narrow: it converts messy real-world descriptions into structured donation data. The routing decision itself is deterministic and explainable so hard constraints are not left to a language model.

**AI interprets. Rules decide.**

Planned AI extensions include multilingual/plain-language assistance, demand forecasting, and impact storytelling.

## Who it is for

- households with surplus food
- restaurants and hotels
- grocery and retail food businesses
- schools, event venues, and corporate cafeterias
- food pantries
- community fridges
- shelters
- churches and mutual-aid groups
- people looking for nearby food resources

## Accessibility approach

FoodMesh is designed so critical information is not map-only, image-only, or audio-only. The MVP includes keyboard navigation support, visible focus states, screen-reader-oriented semantics, responsive reflow, physical accessibility details, and printable schedules.

## Architecture summary

- Next.js full-stack web app
- OpenAI Responses API for structured intake
- deterministic TypeScript matching engine for routing
- Supabase Postgres for persistence
- responsive text-first UI

## Suggested demo sequence

1. **Share Food:** enter a natural-language donation.
2. Show **AI analyzed** and the structured intake.
3. Show the recommended recipient, score breakdown, and alternative matches.
4. Point out that the result is saved to Supabase.
5. Open **Organizations**.
6. Decline the first match to demonstrate automatic rerouting.
7. Accept the next match and show the impact counter update.
8. Open **Find Food**.
9. Demonstrate ZIP, dietary, accessibility, and print filters.

## Suggested 2-minute video script

**0:00-0:20 — Problem**

Usable food can exist in the same neighborhood as need and local capacity, yet still miss the people and organizations that could use it because coordination is fragmented.

**0:20-1:10 — Product demo**

Show a donor entering a surplus-food description. Show AI structuring the information, the explainable recipient match, the score breakdown, and persistence. Then show an organization declining the first match, FoodMesh rerouting automatically, and the next organization accepting it.

**1:10-1:35 — Access**

Show Find Food with ZIP search, dietary filters, physical-accessibility information, and the printable schedule.

**1:35-1:55 — Architecture**

Explain that AI interprets the donor's words, deterministic software enforces routing constraints, and Supabase stores the routing state.

**1:55-2:00 — Close**

FoodMesh helps communities see what they already have and makes local food sharing easier to coordinate.

## Pitch deck themes

1. The village — communities already have resources
2. Where one eats, two can eat — the culture of sharing
3. The connection is missing — surplus, people, and local capacity can still miss each other
4. FoodMesh — Describe → Match → Connect
5. Why AI — practical interpretation of messy real-world input
6. Market + competition — positioned between consumer sharing and institutional rescue
7. Working product — explainable matching and organization workflow
8. Access — nearby food browsing and community coordination
9. Growth — community-by-community expansion
10. Rebuilding the village — technology helps reveal and reconnect local capacity

## Submission links

- GitHub: https://github.com/ocorres/FoodMesh-SASE26
- Live app: https://food-mesh-sase-26.vercel.app
- Demo video: https://youtu.be/0fb1uU2AFtc
- Pitch slides: TODO — add final public slide link if required

## Verified before submission

- Accessibility keyboard and zoom audit passed
- Impact dashboard implemented and verified
- TypeScript check passed
- Production build passed
- Production-mode happy path passed
- Live Vercel deployment confirmed
- OpenAI and Supabase fallbacks are implemented
- Repository secret-pattern scan passed
- npm audit reported 0 vulnerabilities
- Final pitch slides completed
- Final pitch/demo recording completed

## Remaining submission work

- Add the final public slide link if the submission form requires one
- Complete and submit the Devpost entry
