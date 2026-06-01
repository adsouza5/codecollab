# CodeCollab — Real-Time Collaborative Code Editor

> Segment-based multiplayer coding environment — each collaborator owns their segment, sees everyone else's in real time, and can run code without leaving the browser.

## Overview

CodeCollab replaces the traditional shared-buffer model with a **segment ownership** approach: every user creates a named code segment that only they can edit — all other participants see it live but read-only. This eliminates merge conflicts by design. Shared state is synced using **Y.js CRDTs** over a **y-websocket** relay (deployed on Render), so edits converge even under network partitions.

**Monaco Editor** renders each segment with the owner's unique colour decoration and enforces read-only boundaries for non-owners. **Judge0 CE** compiles and runs code in an isolated sandbox, returning stdout, stderr, compile errors, and time-limit-exceeded signals.

## Features

- **Segment ownership** — each collaborator controls exactly one segment; read-only for all others
- **Y.js CRDT sync** — conflict-free real-time merging over WebSocket
- **Monaco Editor** — full IDE experience with syntax highlighting, IntelliSense, and per-owner colour decorations
- **Judge0 CE execution** — sandboxed multi-language runner (JS, TS, Python, Go, Rust, Java) with TLE and compile-error surfacing
- **10 languages** — JavaScript, TypeScript, Python, Go, Rust, Java, C, C++, HTML, CSS
- **Live cursor presence** — see every collaborator's cursor position and colour in real time
- **Camera preview** — optional in-browser webcam panel per user
- **Passcode-protected sessions** — client-side SHA-256 hashing, no plaintext secrets transmitted
- **Session codes** — 8-character alphanumeric room codes for easy sharing

## Stack

| Layer | Technology |
|---|---|
| Real-time sync | Y.js (CRDT), y-websocket |
| Editor | Monaco Editor (@monaco-editor/react) |
| Code execution | Judge0 CE (REST API) |
| Frontend | React |
| WebSocket relay | y-websocket server on Render |
| Auth | Client-side SHA-256 passcode hashing |

## Architecture

```
Browser A (segment owner)       Browser B (read-only)
        ↓                               ↓
  Y.js Doc (local)               Y.js Doc (local)
        ↕  WebSocket (y-websocket relay on Render)  ↕
        └───────────────────────────────────────────┘

Run button → Judge0 CE API → stdout / stderr / TLE
```

## Live Demo

Available at [adamdsouza.com](https://adamdsouza.com) → CodeCollab project card.

## License

MIT
