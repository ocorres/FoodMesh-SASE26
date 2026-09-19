# FoodMesh Accessibility MVP Audit

FoodMesh is designed to support assistive-technology users, but this checklist is an MVP verification aid rather than a claim of formal WCAG certification.

## Keyboard-only

Test without a mouse:

1. Load the home page and press Tab.
2. Confirm the "Skip to main content" link becomes visible and moves focus to the main content.
3. Tab through Find Food, Share Food, and Organizations.
4. On Find Food, operate ZIP search, dietary select, accessibility checkboxes, and Print schedule.
5. On Share Food, complete and submit a donation. After processing, focus should move to the donation result heading.
6. On Organizations, operate Accept donation and Decline & reroute.
7. Confirm every focused control has a clearly visible focus indicator.

## Screen reader / semantics

Recommended quick test: NVDA + Chrome on Windows.

Verify:
- Pages have one clear main landmark.
- Heading order is understandable.
- Form controls announce their labels and helper text.
- Find Food result counts are announced after filters/search change.
- Share Food analysis and save status are announced.
- Organization workflow status messages are announced after accept/decline actions.
- Location accessibility details are available as text.
- No critical feature requires a map, image, audio, hover, or color alone.

## Zoom and reflow

At 200% and 400% browser zoom:
- Primary actions remain visible and operable.
- Forms reflow vertically.
- Result cards do not require horizontal scrolling for essential content.
- Match score grids collapse for narrow viewports.
- Location headers, alternative matches, and routing cards stack on narrow screens.
- Text remains readable without clipping.

## Motion

With the operating system reduced-motion preference enabled, FoodMesh disables smooth-scroll behavior. The MVP does not depend on animation to communicate state.

## Physical accessibility information

Find Food and recipient-match views expose concrete access details such as:
- step-free / wheelchair-accessible entrances
- accessible parking
- curbside handoff
- ground-level access
- nearby transit where available

Demo accessibility details are labeled as demo/location-provided data rather than verified compliance claims.

## Manual audit status

Before final submission, record:
- [ ] Keyboard-only pass
- [ ] NVDA + Chrome smoke test
- [ ] 200% zoom pass
- [ ] 400% zoom pass
- [ ] Print schedule pass
- [ ] Accept/decline live-status pass
