import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { Recipe, RecipeInput, RecipeUpdate } from './types.js';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'recipes.db');

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL DEFAULT '[]',
    instructions TEXT NOT NULL DEFAULT '[]',
    prep_time   INTEGER,
    cook_time   INTEGER,
    servings    INTEGER,
    cuisine     TEXT,
    tags        TEXT NOT NULL DEFAULT '[]',
    source      TEXT,
    image_url   TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_recipes_name      ON recipes(name);
  CREATE INDEX IF NOT EXISTS idx_recipes_cuisine   ON recipes(cuisine);
  CREATE INDEX IF NOT EXISTS idx_recipes_created   ON recipes(created_at DESC);
`);

function rowToRecipe(row: Record<string, unknown>): Recipe {
  return {
    id:          row.id as string,
    name:        row.name as string,
    description: row.description as string | undefined,
    ingredients: JSON.parse(row.ingredients as string || '[]'),
    instructions: JSON.parse(row.instructions as string || '[]'),
    prepTime:    row.prep_time as number | undefined,
    cookTime:    row.cook_time as number | undefined,
    servings:    row.servings as number | undefined,
    cuisine:     row.cuisine as string | undefined,
    tags:        JSON.parse(row.tags as string || '[]'),
    source:      row.source as string | undefined,
    imageUrl:    row.image_url as string | undefined,
    createdAt:   row.created_at as string,
    updatedAt:   row.updated_at as string,
  };
}

export function saveRecipe(data: RecipeInput): Recipe {
  const id = uuidv4();
  db.prepare(`
    INSERT INTO recipes
      (id, name, description, ingredients, instructions, prep_time, cook_time, servings, cuisine, tags, source, image_url)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.name,
    data.description ?? null,
    JSON.stringify(data.ingredients ?? []),
    JSON.stringify(data.instructions ?? []),
    data.prepTime ?? null,
    data.cookTime ?? null,
    data.servings ?? null,
    data.cuisine ?? null,
    JSON.stringify(data.tags ?? []),
    data.source ?? null,
    data.imageUrl ?? null,
  );
  return getRecipeById(id)!;
}

export function getRecipeById(id: string): Recipe | null {
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToRecipe(row) : null;
}

export function listRecipes(limit = 50, offset = 0): Recipe[] {
  const rows = db.prepare(
    'SELECT * FROM recipes ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(limit, offset) as Record<string, unknown>[];
  return rows.map(rowToRecipe);
}

export function searchRecipes(query: string): Recipe[] {
  const q = `%${query}%`;
  const rows = db.prepare(`
    SELECT * FROM recipes
    WHERE name LIKE ? OR description LIKE ? OR ingredients LIKE ? OR cuisine LIKE ? OR tags LIKE ?
    ORDER BY created_at DESC
    LIMIT 30
  `).all(q, q, q, q, q) as Record<string, unknown>[];
  return rows.map(rowToRecipe);
}

export function updateRecipe(id: string, data: RecipeUpdate): Recipe | null {
  const existing = getRecipeById(id);
  if (!existing) return null;

  const merged = { ...existing, ...data };
  db.prepare(`
    UPDATE recipes SET
      name = ?, description = ?, ingredients = ?, instructions = ?,
      prep_time = ?, cook_time = ?, servings = ?, cuisine = ?,
      tags = ?, source = ?, image_url = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    merged.name,
    merged.description ?? null,
    JSON.stringify(merged.ingredients),
    JSON.stringify(merged.instructions),
    merged.prepTime ?? null,
    merged.cookTime ?? null,
    merged.servings ?? null,
    merged.cuisine ?? null,
    JSON.stringify(merged.tags),
    merged.source ?? null,
    merged.imageUrl ?? null,
    id,
  );
  return getRecipeById(id);
}

export function deleteRecipe(id: string): boolean {
  const result = db.prepare('DELETE FROM recipes WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getTotalCount(): number {
  const row = db.prepare('SELECT COUNT(*) as count FROM recipes').get() as { count: number };
  return row.count;
}
