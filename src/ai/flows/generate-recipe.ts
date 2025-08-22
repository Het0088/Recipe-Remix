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
import { GenerateRecipeOutputSchema } from '@/ai/schemas';

const GenerateRecipeInputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of ingredients available to use in the recipe.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;
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
  Finally, provide an estimated nutritional information breakdown per serving, including calories, protein, carbs, and fat.
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
