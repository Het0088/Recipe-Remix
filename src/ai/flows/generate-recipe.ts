// This file holds the Genkit flow for generating recipes based on user-provided ingredients.

'use server';

/**
 * @fileOverview Recipe generation AI agent.
 *
 * - generateRecipe - A function that generates a recipe based on ingredients.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of ingredients available to use in the recipe.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
  instructions: z.string().describe('The instructions for preparing the recipe.'),
  difficulty: z.string().describe('The difficulty level of the recipe (e.g., Easy, Medium, Hard).'),
  cookingTime: z.string().describe('The estimated cooking time for the recipe (e.g., "30 minutes").'),
  cuisine: z.string().describe('The cuisine type of the recipe (e.g., Italian, Mexican).'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are a chef specializing in creating unique recipes.

  Create a recipe based on the following ingredients: {{{ingredients}}}.
  The recipe should include a name, a list of ingredients, and detailed instructions.
  Also include the difficulty level (Easy, Medium, or Hard), the estimated cooking time, and the cuisine type.
  Make sure the recipe is easy to follow.
  `,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
