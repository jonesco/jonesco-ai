export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;   // minutes
  cookTime?: number;   // minutes
  servings?: number;
  cuisine?: string;
  tags: string[];
  source?: string;     // LLM or user that created the recipe
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type RecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
export type RecipeUpdate = Partial<RecipeInput>;
