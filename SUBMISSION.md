# FoodMesh Submission Working Draft

This file is a working draft for the hackathon submission. Replace placeholders before final submission.

## One-line description

FoodMesh is a hyperlocal food-recovery network that uses AI-assisted intake and deterministic routing to move surplus food from households and businesses to nearby community organizations before it becomes waste.

## Short project description

FoodMesh addresses a simple coordination failure: usable food often exists near people who need it, but donors and community organizations lack a fast, accessible way to connect in real time.

A donor describes surplus food in plain language. OpenAI structures the intake, while deterministic routing logic evaluates category compatibility, quantity, recipient capacity, urgency, distance, storage requirements, dietary-routing metadata, and accessibility. FoodMesh then recommends a recipient and explains why it was selected.

If an organization declines, the donation can be rerouted to the next eligible match. Supabase persists donation state, routing history, and impact data. A separate Find Food experience lets people browse nearby food availability without requiring an account and includes text-based accessibility information and printable schedules.

## Why AI is useful here

The AI component is deliberately narrow: it converts messy real-world descriptions into structured donation data. The routing decision itself is deterministic and explainable so that hard constraints are not left to a language model.

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

Usable food is wasted while nearby community organizations are trying to serve people with limited visibility into what is available. Existing coordination is often fragmented and manual.

**0:20-1:10 — Product demo**

Show a donor entering a surplus-food description. Show AI structuring the information, the explainable recipient match, the score breakdown, and persistence. Then show an organization declining the first match, FoodMesh rerouting automatically, and the next organization accepting it.

**1:10-1:35 — Access**

Show Find Food with ZIP search, dietary filters, physical-accessibility information, and the printable schedule.

**1:35-1:55 — Architecture**

Explain that AI interprets the donor's words, deterministic software enforces routing constraints, and Supabase stores the routing state.

**1:55-2:00 — Close**

FoodMesh helps communities move usable food faster, with less friction and more dignity.

## Pitch deck outline

1. Problem — surplus food and fragmented local coordination
2. Who is affected — donors, community organizations, and people seeking food
3. FoodMesh — hyperlocal recovery and routing
4. How it works — AI intake + deterministic matching + Supabase
5. Live/demo result — rerouting and acceptance
6. Accessibility + impact
7. Closing — food shared with dignity

## Submission links

- GitHub: https://github.com/ocorres/FoodMesh-SASE26
- Live app: TODO
- Demo video: TODO
- Pitch slides: TODO

## Remaining verification before submission

- Complete accessibility audit
- Build impact dashboard
- Run production build
- Repeat full happy path
- Verify fallback behavior with OpenAI unavailable
- Confirm no secrets are committed
- Deploy
- Record video
- Finalize screenshots/slides
