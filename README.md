# CodeCollab — Real-Time Collaborative Code Editor

Multi-user code editor where each participant owns a private segment. Changes broadcast instantly via WebSocket (Socket.io). Users get assigned unique colors, can create named segments in any language, and see each other's edits update live.

**[Live Demo](https://adsouza5.github.io/portfolio-react/projects/codecollab)**

## Architecture

```
Browser (React client)
      │  Socket.io
      ▼
Node.js / Express server
      │
      ├── join           ──▶  assign color, sync all users + segments
      ├── segment:create ──▶  broadcast new segment to room
      ├── segment:update ──▶  owner-only edit, broadcast content delta
      ├── segment:delete ──▶  owner-only, broadcast removal
      └── disconnect     ──▶  remove user, update presence list
```

## Features

- **Segment ownership** — each user creates and owns their own code block; others can read but not edit
- **Live presence** — connected users shown with distinct colors; list updates on join/leave
- **Multi-language** — segments support any Monaco-supported language (JS, Python, Go, etc.)
- **Instant sync** — Socket.io broadcasts content deltas to all connected clients on every keystroke

## Tech Stack

| Layer | Technology |
|---|---|
| Server | Node.js, Express |
| Real-time | Socket.io v4 |
| Client | React |
| Hosting | Firebase |

## Local Development

```bash
# Server
git clone https://github.com/adsouza5/codecollab
cd codecollab
npm install
npm run dev
# Server on :5000

# Client
cd client
npm install
npm start
# Client on :3000
```

## Deployment

```bash
firebase deploy
```
