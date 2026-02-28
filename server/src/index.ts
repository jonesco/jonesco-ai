import express from 'express';
import cors from 'cors';
import { handleSSE, handleMessages } from './mcp-server.js';
import recipesRouter from './api.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'recipe-saver-mcp', version: '1.0.0' });
});

// ── MCP endpoints (for AI clients) ───────────────────────────────────────────
// LLMs connect via:  GET  /sse         (establishes SSE stream)
// Then send tools:   POST /messages?sessionId=<id>
app.get('/sse', handleSSE);
app.post('/messages', handleMessages);

// ── REST API (for iOS app) ────────────────────────────────────────────────────
app.use('/api/recipes', recipesRouter);

// ── Root info ─────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    service: 'Recipe Saver MCP Server',
    mcp: {
      sse:      '/sse',
      messages: '/messages',
    },
    api: {
      recipes: '/api/recipes',
    },
    docs: 'Add this server to Claude Desktop via mcp config or connect any MCP-compatible LLM.',
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🍽️  Recipe Saver MCP Server`);
  console.log(`   Port:       ${PORT}`);
  console.log(`   MCP SSE:    http://localhost:${PORT}/sse`);
  console.log(`   REST API:   http://localhost:${PORT}/api/recipes`);
  console.log(`   Health:     http://localhost:${PORT}/health\n`);
});
