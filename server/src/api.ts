import { Router, Request, Response } from 'express';
import {
  saveRecipe,
  getRecipeById,
  listRecipes,
  searchRecipes,
  updateRecipe,
  deleteRecipe,
  getTotalCount,
} from './database.js';

const router = Router();

// GET /api/recipes?q=search&limit=50&offset=0
router.get('/', (req: Request, res: Response) => {
  const q      = req.query.q as string | undefined;
  const limit  = Math.min(parseInt(req.query.limit  as string) || 50, 100);
  const offset = parseInt(req.query.offset as string) || 0;

  if (q) {
    const recipes = searchRecipes(q);
    res.json({ recipes, total: recipes.length });
  } else {
    const recipes = listRecipes(limit, offset);
    const total   = getTotalCount();
    res.json({ recipes, total, limit, offset });
  }
});

// GET /api/recipes/:id
router.get('/:id', (req: Request, res: Response) => {
  const recipe = getRecipeById(req.params.id);
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }
  res.json(recipe);
});

// POST /api/recipes
router.post('/', (req: Request, res: Response) => {
  try {
    if (!req.body.name || !Array.isArray(req.body.ingredients) || !Array.isArray(req.body.instructions)) {
      res.status(400).json({ error: 'name, ingredients (array), and instructions (array) are required' });
      return;
    }
    const recipe = saveRecipe(req.body);
    res.status(201).json(recipe);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

// PUT /api/recipes/:id
router.put('/:id', (req: Request, res: Response) => {
  const recipe = updateRecipe(req.params.id, req.body);
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }
  res.json(recipe);
});

// DELETE /api/recipes/:id
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = deleteRecipe(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }
  res.status(204).send();
});

export default router;
