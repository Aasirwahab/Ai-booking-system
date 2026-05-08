# Appointment Booking SaaS

AI-powered booking and client management system for service businesses (clinics, salons, fitness, tutoring, real estate, legal, agencies, custom).

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Auth:** Clerk (with Organizations)
- **Database:** Supabase Postgres + RLS + Realtime
- **AI:** OpenAI (`gpt-4o-mini` default), tool-calling agent
- **Email:** Resend

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

## Architecture

See `D:\Award winning components template\Misc\appointment_booking_saas_architecture.md` for the full system design, ER diagram, and flowcharts.

## Build Phases

| Phase | Scope |
|-------|-------|
| 0 | Foundation cleanup + env (current) |
| 1 | DB schema + RLS |
| 2 | Clerk auth + org resolution |
| 3 | Onboarding + niche picker |
| 4 | CRUD: services, staff, contacts, availability |
| 5 | Slot computation + bookings |
| 6 | Public booking page + email confirmation |
| 7 | Realtime dashboard |
| 8 | Iframe embed + integration settings |
| 9 | OpenAI chat widget with tool calling |
| 10 | Polish |

## Coding Guidelines

See `CLAUDE.md`.
