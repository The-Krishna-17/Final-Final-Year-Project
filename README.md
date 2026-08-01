# SkillXchange — Frontend

Next.js 16 frontend for the SkillXchange peer-to-peer skill-swap platform.

**Live:** [https://skillsxchange.vercel.app](https://skillsxchange.vercel.app)

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui** components
- **Redux Toolkit** for global state
- **Socket.IO client** for real-time chat and notifications
- **Jitsi React SDK** for in-browser video meetings
- **Axios** with auto token-refresh interceptors

## Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
```

## Environment Variables

Create a `.env` file in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

> For Vercel production, add `NEXT_PUBLIC_SOCKET_URL=https://final-final-year-project-backend.onrender.com` in the Vercel dashboard.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` `/signup` | Authentication |
| `/forgot-password` `/reset-password` | Password recovery |
| `/dashboard` | User overview |
| `/matches` | Skill-match discovery |
| `/connections` | Active swap partners |
| `/requests` | Incoming/outgoing swap requests |
| `/messages` | Real-time chat |
| `/meetings` | Video room scheduling & joining |
| `/notifications` | Activity notifications |
| `/my-skills` | Skill management |
| `/profile` | User profile |
