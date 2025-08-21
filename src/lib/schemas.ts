import { z } from 'zod';

export const recipeGenerationSchema = z.object({
  ingredients: z
    .array(
      z.object({
        value: z.string().min(1, { message: 'Ingredient cannot be empty.' }),
      })
    )
    .min(1, { message: 'Please add at least one ingredient.' }),
});

export const recipeViabilitySchema = z.object({
  recipeName: z
    .string()
    .min(3, { message: 'Recipe name must be at least 3 characters long.' }),
  ingredients: z.string().min(10, {
    message: 'Ingredients list must be at least 10 characters long.',
  }),
  instructions: z.string().min(20, {
    message: 'Instructions must be at least 20 characters long.',
  }),
});

export type RecipeGenerationValues = z.infer<typeof recipeGenerationSchema>;
export type RecipeViabilityValues = z.infer<typeof recipeViabilitySchema>;
