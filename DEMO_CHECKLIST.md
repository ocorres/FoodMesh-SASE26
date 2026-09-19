# FoodMesh Demo Hardening Checklist

Use this checklist before recording the final demo.

## Environment

- [ ] `.env.local` contains OpenAI + Supabase values
- [ ] `.env.local` is not committed
- [ ] Supabase schema and organization workflow migration are applied
- [ ] OpenAI Responses permission is enabled

## Happy path

- [ ] Home loads
- [ ] Share Food loads
- [ ] AI intake returns **AI analyzed**
- [ ] Match score and explanation appear
- [ ] Supabase save status says persisted
- [ ] Refresh retains recent donation
- [ ] Organizations queue loads
- [ ] Decline reroutes
- [ ] Accept persists
- [ ] Impact total updates
- [ ] Find Food ZIP search works
- [ ] Dietary filters work
- [ ] Accessibility filters work
- [ ] Print preview works

## Failure path

- [ ] Empty/too-short donation input is handled
- [ ] OpenAI failure falls back to local parser
- [ ] Supabase failure does not block donation analysis
- [ ] No-match state is understandable
- [ ] Invalid Find Food ZIP/filter combination has a clear empty state

## Accessibility

- [ ] Keyboard-only pass
- [ ] Skip link visible on focus
- [ ] Visible focus on every primary control
- [ ] 200% zoom pass
- [ ] 400% zoom pass
- [ ] Quick NVDA + Chrome smoke test

## Security / privacy

- [ ] No `sk-` key appears in repository
- [ ] No `sb_secret_` key appears in repository
- [ ] No Supabase service-role credential appears in repository
- [ ] Demo data contains no sensitive recipient information

## Recording

- [ ] Seed one clean donation for recording
- [ ] Clear distracting stale demo records if needed
- [ ] Browser zoom set consistently
- [ ] Notifications/popups disabled
- [ ] Dev server or deployed app is stable
- [ ] Backup demo path prepared
