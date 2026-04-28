const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors());

// Soothing muted palette — readable on dark backgrounds
const USER_COLORS = [
  '#5b9cf6', // soft blue
  '#6bcb8b', // sage green
  '#c084fc', // lavender
  '#f9a96b', // peach
  '#5dd8d8', // teal
  '#f87ba6', // rose
  '#fbbf24', // amber
  '#93c5fd', // sky
  '#86efac', // mint
  '#d8b4fe', // violet
];

const users = {};    // socketId -> { id, name, color }
const segments = {}; // segmentId -> { id, name, language, ownerId, ownerName, ownerColor, content }

function assignColor() {
  const used = new Set(Object.values(users).map((u) => u.color));
  return USER_COLORS.find((c) => !used.has(c)) ?? USER_COLORS[Object.keys(users).length % USER_COLORS.length];
}

io.on('connection', (socket) => {
  // ── Join ──────────────────────────────────────────────────
  socket.on('join', ({ name }) => {
    users[socket.id] = { id: socket.id, name, color: assignColor() };
    socket.emit('joined', {
      user: users[socket.id],
      users: Object.values(users),
      segments: Object.values(segments),
    });
    socket.broadcast.emit('users:update', Object.values(users));
  });

  // ── Create segment ─────────────────────────────────────────
  socket.on('segment:create', ({ name, language }) => {
    const user = users[socket.id];
    if (!user) return;
    const id = `seg_${Date.now()}`;
    segments[id] = {
      id,
      name,
      language: language || 'javascript',
      ownerId: socket.id,
      ownerName: user.name,
      ownerColor: user.color,
      content: `// ${name}\n// ${user.name}'s workspace\n\n`,
    };
    io.emit('segments:update', Object.values(segments));
  });

  // ── Edit segment (owner only) ──────────────────────────────
  socket.on('segment:update', ({ segmentId, content }) => {
    const seg = segments[segmentId];
    if (!seg || seg.ownerId !== socket.id) return;
    seg.content = content;
    socket.broadcast.emit('segment:content', { segmentId, content });
  });

  // ── Delete segment (owner only) ────────────────────────────
  socket.on('segment:delete', ({ segmentId }) => {
    if (segments[segmentId]?.ownerId !== socket.id) return;
    delete segments[segmentId];
    io.emit('segments:update', Object.values(segments));
  });

  // ── Disconnect ─────────────────────────────────────────────
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('users:update', Object.values(users));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`CodeCollab server on port ${PORT}`));
