// This file holds the Genkit flow for generating variations of a given recipe.

'use server';

/**
 * @fileOverview Recipe variation generation AI agent.
 *
 * - generateRecipeVariation - A function that generates a variation of a recipe.
 * - GenerateRecipeVariationInput - The input type for the generateRecipeVariation function.
 * - GenerateRecipeVariationOutput - The return type for the generateRecipeVariation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  GenerateRecipeOutputSchema,
  GenerateRecipeVariationInputSchema,
} from '@/ai/schemas';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';

export type GenerateRecipeVariationInput = z.infer<
  typeof GenerateRecipeVariationInputSchema
>;

export type GenerateRecipeVariationOutput = GenerateRecipeOutput;

export async function generateRecipeVariation(
  input: GenerateRecipeVariationInput
): Promise<GenerateRecipeVariationOutput> {
  return generateRecipeVariationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeVariationPrompt',
  input: { schema: GenerateRecipeVariationInputSchema },
  output: { schema: GenerateRecipeOutputSchema },
  prompt: `You are a chef specializing in adapting and modifying recipes.

You have been given the following recipe:
Recipe Name: {{{recipe.recipeName}}}
Cuisine: {{{recipe.cuisine}}}
Difficulty: {{{recipe.difficulty}}}
Cooking Time: {{{recipe.cookingTime}}}
Ingredients:
{{#each recipe.ingredients}}
- {{{this}}}
{{/each}}
Instructions:
{{{recipe.instructions}}}

Your task is to modify this recipe based on the following request: "{{{variation}}}"

Generate a new version of the recipe that incorporates the requested change.
You must provide a complete, new recipe, including a new name (if appropriate), a full list of ingredients, and complete instructions.
Do not just describe the changes. Output the entire new recipe in the correct format.
Also provide the new difficulty, cooking time, cuisine, and estimated nutritional information.
`,
});

const generateRecipeVariationFlow = ai.defineFlow(
  {
    name: 'generateRecipeVariationFlow',
    inputSchema: GenerateRecipeVariationInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
