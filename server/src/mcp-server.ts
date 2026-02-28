import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Request, Response } from 'express';
import {
  saveRecipe,
  getRecipeById,
  listRecipes,
  searchRecipes,
  updateRecipe,
  deleteRecipe,
  getTotalCount,
} from './database.js';

function createServer(): Server {
  const server = new Server(
    { name: 'recipe-saver', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  // ── List available tools ────────────────────────────────────────────────────
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'save_recipe',
        description:
          'Save a new recipe to the recipe collection. Use this whenever a user asks you to create or save a recipe.',
        inputSchema: {
          type: 'object',
          properties: {
            name:         { type: 'string',  description: 'Recipe name (required)' },
            description:  { type: 'string',  description: 'A brief summary of the dish' },
            ingredients:  { type: 'array',   items: { type: 'string' }, description: 'List of ingredients, each as a string (e.g., "2 cups flour")' },
            instructions: { type: 'array',   items: { type: 'string' }, description: 'Step-by-step cooking instructions' },
            prepTime:     { type: 'number',  description: 'Prep time in minutes' },
            cookTime:     { type: 'number',  description: 'Cook time in minutes' },
            servings:     { type: 'number',  description: 'Number of servings' },
            cuisine:      { type: 'string',  description: 'Cuisine type (e.g., Italian, Mexican, Thai)' },
            tags:         { type: 'array',   items: { type: 'string' }, description: 'Tags for categorization (e.g., ["vegetarian", "quick", "dessert"])' },
            source:       { type: 'string',  description: 'Source of the recipe (e.g., "Claude", "GPT-4", "User")' },
          },
          required: ['name', 'ingredients', 'instructions'],
        },
      },
      {
        name: 'list_recipes',
        description: 'List saved recipes, newest first. Supports pagination.',
        inputSchema: {
          type: 'object',
          properties: {
            limit:  { type: 'number', description: 'Max results to return (default 20, max 100)' },
            offset: { type: 'number', description: 'Number of results to skip for pagination' },
          },
        },
      },
      {
        name: 'get_recipe',
        description: 'Retrieve the full details of a specific recipe by its ID.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The recipe ID (UUID)' },
          },
          required: ['id'],
        },
      },
      {
        name: 'search_recipes',
        description: 'Search recipes by name, ingredient, cuisine, description, or tag.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search term to look for across all recipe fields' },
          },
          required: ['query'],
        },
      },
      {
        name: 'update_recipe',
        description: 'Update fields of an existing recipe. Only the fields you provide will be changed.',
        inputSchema: {
          type: 'object',
          properties: {
            id:           { type: 'string',  description: 'The recipe ID to update (required)' },
            name:         { type: 'string' },
            description:  { type: 'string' },
            ingredients:  { type: 'array',  items: { type: 'string' } },
            instructions: { type: 'array',  items: { type: 'string' } },
            prepTime:     { type: 'number' },
            cookTime:     { type: 'number' },
            servings:     { type: 'number' },
            cuisine:      { type: 'string' },
            tags:         { type: 'array',  items: { type: 'string' } },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_recipe',
        description: 'Permanently delete a recipe by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The recipe ID to delete' },
          },
          required: ['id'],
        },
      },
    ],
  }));

  // ── Handle tool calls ───────────────────────────────────────────────────────
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    switch (name) {
      case 'save_recipe': {
        const recipe = saveRecipe({
          name:         args.name as string,
          description:  args.description as string | undefined,
          ingredients:  (args.ingredients as string[]) ?? [],
          instructions: (args.instructions as string[]) ?? [],
          prepTime:     args.prepTime as number | undefined,
          cookTime:     args.cookTime as number | undefined,
          servings:     args.servings as number | undefined,
          cuisine:      args.cuisine as string | undefined,
          tags:         (args.tags as string[]) ?? [],
          source:       args.source as string | undefined,
          imageUrl:     undefined,
        });
        return {
          content: [{
            type: 'text',
            text: `Recipe saved successfully!\n\nID: ${recipe.id}\nName: ${recipe.name}\n\n${JSON.stringify(recipe, null, 2)}`,
          }],
        };
      }

      case 'list_recipes': {
        const limit  = Math.min((args.limit as number) ?? 20, 100);
        const offset = (args.offset as number) ?? 0;
        const recipes = listRecipes(limit, offset);
        const total   = getTotalCount();
        const summary = recipes.map(r =>
          `• ${r.id} — ${r.name}${r.cuisine ? ` (${r.cuisine})` : ''}`
        ).join('\n');
        return {
          content: [{
            type: 'text',
            text: `Showing ${recipes.length} of ${total} recipes:\n\n${summary}\n\nFull data:\n${JSON.stringify(recipes, null, 2)}`,
          }],
        };
      }

      case 'get_recipe': {
        const recipe = getRecipeById(args.id as string);
        if (!recipe) {
          return {
            content: [{ type: 'text', text: `No recipe found with ID: ${args.id}` }],
            isError: true,
          };
        }
        return { content: [{ type: 'text', text: JSON.stringify(recipe, null, 2) }] };
      }

      case 'search_recipes': {
        const recipes = searchRecipes(args.query as string);
        if (recipes.length === 0) {
          return { content: [{ type: 'text', text: `No recipes found matching "${args.query}"` }] };
        }
        return {
          content: [{
            type: 'text',
            text: `Found ${recipes.length} recipe(s) matching "${args.query}":\n\n${JSON.stringify(recipes, null, 2)}`,
          }],
        };
      }

      case 'update_recipe': {
        const recipe = updateRecipe(args.id as string, {
          name:         args.name as string | undefined,
          description:  args.description as string | undefined,
          ingredients:  args.ingredients as string[] | undefined,
          instructions: args.instructions as string[] | undefined,
          prepTime:     args.prepTime as number | undefined,
          cookTime:     args.cookTime as number | undefined,
          servings:     args.servings as number | undefined,
          cuisine:      args.cuisine as string | undefined,
          tags:         args.tags as string[] | undefined,
        });
        if (!recipe) {
          return {
            content: [{ type: 'text', text: `No recipe found with ID: ${args.id}` }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: `Recipe updated!\n\n${JSON.stringify(recipe, null, 2)}` }],
        };
      }

      case 'delete_recipe': {
        const deleted = deleteRecipe(args.id as string);
        return {
          content: [{
            type: 'text',
            text: deleted
              ? `Recipe ${args.id} deleted successfully.`
              : `No recipe found with ID: ${args.id}`,
          }],
          isError: !deleted,
        };
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  });

  return server;
}

// ── SSE transport management ──────────────────────────────────────────────────
// Each browser/LLM connection gets its own Server + SSEServerTransport pair.
const transports = new Map<string, SSEServerTransport>();

export async function handleSSE(req: Request, res: Response): Promise<void> {
  const server    = createServer();
  const transport = new SSEServerTransport('/messages', res);
  const sessionId = transport.sessionId;

  transports.set(sessionId, transport);
  res.on('close', () => transports.delete(sessionId));

  await server.connect(transport);
}

export async function handleMessages(req: Request, res: Response): Promise<void> {
  const sessionId = req.query.sessionId as string;
  const transport = transports.get(sessionId);

  if (!transport) {
    res.status(404).json({ error: 'Session not found. Connect via GET /sse first.' });
    return;
  }

  await transport.handlePostMessage(req, res);
}
