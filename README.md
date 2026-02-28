# Recipe Saver — MCP Server + iOS App

Save AI-generated recipes from any LLM and browse them on your iPhone.

```
┌─────────────────┐        MCP (SSE)         ┌──────────────────────┐
│  Claude / GPT-4 │ ───────────────────────► │  Recipe Saver Server │
│  Any MCP client │                           │  (Node.js + SQLite)  │
└─────────────────┘                           └──────────┬───────────┘
                                                         │  REST API
                                              ┌──────────▼───────────┐
                                              │   RecipeSaver iOS App │
                                              │      (SwiftUI)        │
                                              └──────────────────────┘
```

---

## Quick Start

### 1. Deploy the MCP Server

**Option A — Render.com (recommended, free)**

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo — Render auto-detects `render.yaml`
4. Deploy. Your server URL will be `https://recipe-saver-mcp-xxxx.onrender.com`

**Option B — Run locally**

```bash
cd server
npm install
npm run dev
# Server at http://localhost:3000
```

---

### 2. Connect Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "recipe-saver": {
      "url": "https://YOUR-SERVER.onrender.com/sse",
      "transport": "sse"
    }
  }
}
```

Restart Claude Desktop. Now ask Claude:

> *"Save a recipe for classic spaghetti carbonara to my recipe collection."*

---

### 3. Open the iOS App

1. Open `ios/RecipeSaver.xcodeproj` in Xcode (requires Xcode 15+)
2. Select your iPhone as the build target
3. Build and run (`Cmd+R`)
4. In **Settings**, paste your server URL
5. Your AI-saved recipes appear instantly!

---

## MCP Tools

The server exposes these tools to any connected LLM:

| Tool | Description |
|------|-------------|
| `save_recipe` | Save a new recipe (name, ingredients, instructions, etc.) |
| `list_recipes` | List all saved recipes with pagination |
| `get_recipe` | Get a specific recipe by ID |
| `search_recipes` | Search by name, ingredient, cuisine, or tag |
| `update_recipe` | Update fields of an existing recipe |
| `delete_recipe` | Permanently delete a recipe |

---

## REST API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/recipes` | List recipes (`?q=search&limit=50&offset=0`) |
| GET | `/api/recipes/:id` | Get recipe by ID |
| POST | `/api/recipes` | Create a recipe |
| PUT | `/api/recipes/:id` | Update a recipe |
| DELETE | `/api/recipes/:id` | Delete a recipe |
| GET | `/health` | Health check |
| GET | `/sse` | MCP SSE endpoint |
| POST | `/messages` | MCP message endpoint |

---

## Project Structure

```
├── server/                   # MCP Server (Node.js + TypeScript)
│   ├── src/
│   │   ├── index.ts          # Entry point (Express app)
│   │   ├── mcp-server.ts     # MCP protocol + tools
│   │   ├── api.ts            # REST API routes
│   │   ├── database.ts       # SQLite data layer
│   │   └── types.ts          # Shared types
│   ├── package.json
│   └── Dockerfile
│
├── ios/                      # iOS App (SwiftUI)
│   ├── RecipeSaver.xcodeproj/
│   └── RecipeSaver/
│       ├── RecipeSaverApp.swift
│       ├── ContentView.swift
│       ├── Models/Recipe.swift
│       ├── Views/
│       │   ├── RecipeListView.swift
│       │   ├── RecipeDetailView.swift
│       │   └── AddRecipeView.swift
│       ├── Services/RecipeService.swift
│       └── Settings/SettingsView.swift
│
└── render.yaml               # Render.com deployment config
```

---

## Recipe Data Model

```typescript
{
  id:           string,   // UUID
  name:         string,
  description:  string?,
  ingredients:  string[], // ["2 cups flour", "1 tsp salt", ...]
  instructions: string[], // ["Preheat oven...", "Mix dry...", ...]
  prepTime:     number?,  // minutes
  cookTime:     number?,  // minutes
  servings:     number?,
  cuisine:      string?,  // "Italian", "Mexican", etc.
  tags:         string[], // ["vegetarian", "quick", "dessert"]
  source:       string?,  // "Claude", "GPT-4", "iOS App"
  createdAt:    string,   // ISO datetime
  updatedAt:    string
}
```
