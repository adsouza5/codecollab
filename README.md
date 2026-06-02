# CodeCollab — Real-Time Collaborative Code Editor

> Segment-based multiplayer coding environment — each collaborator owns their segment, sees everyone else's in real time, and can run code without leaving the browser.

Live at **[www.iadamdsouza.com](https://www.iadamdsouza.com)**

## Architecture

```
Browser A (segment owner)          Browser B (read-only viewer)
        │                                    │
   Y.js Doc (local)                    Y.js Doc (local)
        │                                    │
        └──────────  y-websocket relay  ──────┘
                       (Render)

Run button
    │
    ▼
Judge0 CE REST API
    │
    ▼
stdout · stderr · compile errors · TLE
```

## Features

- **Segment ownership** — each collaborator controls exactly one segment; read-only for all others — merge conflicts eliminated by design
- **Y.js CRDT sync** — conflict-free real-time merging over WebSocket, converges under network partitions
- **Monaco Editor** — full IDE experience with syntax highlighting, IntelliSense, and per-owner colour decorations
- **Judge0 CE execution** — sandboxed multi-language runner with TLE and compile-error surfacing
- **10 languages** — JavaScript, TypeScript, Python, Go, Rust, Java, C, C++, HTML, CSS
- **Live cursor presence** — see every collaborator's cursor position and colour in real time
- **Camera preview** — optional in-browser webcam panel per user
- **Passcode-protected sessions** — client-side SHA-256 hashing, no plaintext secrets transmitted
- **Session codes** — 8-character alphanumeric room codes for easy sharing

## Stack

| Layer | Technology |
|---|---|
| Real-time sync | Y.js (CRDT) · y-websocket |
| Editor | Monaco Editor (@monaco-editor/react) |
| Code execution | Judge0 CE (REST API) |
| Frontend | React |
| WebSocket relay | y-websocket server on Render |
| Auth | Client-side SHA-256 passcode hashing |

## Local Development

```bash
git clone https://github.com/adsouza5/codecollab
cd codecollab
npm install
npm run dev
# App on :5173
```

The y-websocket relay defaults to the hosted instance on Render. To run locally:

```bash
npx y-websocket-server
# WebSocket on :1234
```

## License

MIT
