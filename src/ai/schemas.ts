// This file contains shared Zod schemas used across different AI flows.

import { z } from 'zod';

export const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z
    .array(z.string())
    .describe('The ingredients required for the recipe.'),
  instructions: z
    .string()
    .describe('The instructions for preparing the recipe.'),
  difficulty: z
    .string()
    .describe('The difficulty level of the recipe (e.g., Easy, Medium, Hard).'),
  cookingTime: z
    .string()
    .describe('The estimated cooking time for the recipe (e.g., "30 minutes").'),
  cuisine: z
    .string()
    .describe('The cuisine type of the recipe (e.g., Italian, Mexican).'),
  nutritionalInfo: z
    .object({
      calories: z.string().describe('Estimated calories per serving.'),
      protein: z.string().describe('Estimated protein in grams per serving.'),
      carbs: z
        .string()
        .describe('Estimated carbohydrates in grams per serving.'),
      fat: z.string().describe('Estimated fat in grams per serving.'),
    })
    .describe('The estimated nutritional information per serving.'),
  imageUrl: z.string().describe("A data URI of the generated image. Expected format: 'data:<mimetype>;base64,<encoded_data>'.").optional(),
});

export const GenerateRecipeVariationInputSchema = z.object({
  recipe: GenerateRecipeOutputSchema.describe('The original recipe to modify.'),
  variation: z
    .string()
    .describe(
      'The requested variation (e.g., "make it vegan", "make it spicier", "double the servings").'
    ),
});
