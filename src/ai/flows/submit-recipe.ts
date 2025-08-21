'use server';

/**
 * @fileOverview A recipe submission AI agent.
 *
 * - submitRecipe - A function that handles the recipe submission process.
 * - SubmitRecipeInput - The input type for the submitRecipe function.
 * - SubmitRecipeOutput - The return type for the submitRecipe function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { checkRecipeViability } from './check-recipe-viability';
import * as fs from 'fs/promises';
import * as path from 'path';

const SubmitRecipeInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('The ingredients of the recipe.'),
  instructions: z.string().describe('The instructions of the recipe.'),
});
export type SubmitRecipeInput = z.infer<typeof SubmitRecipeInputSchema>;

const SubmitRecipeOutputSchema = z.object({
  wasViable: z.boolean().describe('Whether or not the recipe was viable and saved.'),
});
export type SubmitRecipeOutput = z.infer<typeof SubmitRecipeOutputSchema>;

export async function submitRecipe(input: SubmitRecipeInput): Promise<SubmitRecipeOutput> {
  return submitRecipeFlow(input);
}

const submitRecipeFlow = ai.defineFlow(
  {
    name: 'submitRecipeFlow',
    inputSchema: SubmitRecipeInputSchema,
    outputSchema: SubmitRecipeOutputSchema,
  },
  async (input) => {
    const viabilityResult = await checkRecipeViability(input);

    if (!viabilityResult.isViable) {
      return { wasViable: false };
    }

    const RECIPES_FILE = path.join(process.cwd(), 'submitted-recipes.json');

    let existingRecipes: SubmitRecipeInput[] = [];
    try {
      const fileContent = await fs.readFile(RECIPES_FILE, 'utf-8');
      existingRecipes = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet, which is fine.
    }

    existingRecipes.push(input);

    await fs.writeFile(RECIPES_FILE, JSON.stringify(existingRecipes, null, 2));

    return { wasViable: true };
  }
);
