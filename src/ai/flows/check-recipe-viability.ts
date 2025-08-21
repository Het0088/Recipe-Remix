'use server';

/**
 * @fileOverview A recipe viability check AI agent.
 *
 * - checkRecipeViability - A function that handles the recipe viability check process.
 * - CheckRecipeViabilityInput - The input type for the checkRecipeViability function.
 * - CheckRecipeViabilityOutput - The return type for the checkRecipeViability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckRecipeViabilityInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('The ingredients of the recipe.'),
  instructions: z.string().describe('The instructions of the recipe.'),
});
export type CheckRecipeViabilityInput = z.infer<typeof CheckRecipeViabilityInputSchema>;

const CheckRecipeViabilityOutputSchema = z.object({
  isViable: z.boolean().describe('Whether or not the recipe is viable.'),
  reasoning: z.string().describe('The reasoning behind the viability assessment.'),
  suggestions: z.string().describe('Suggestions for improving the recipe, if any.'),
});
export type CheckRecipeViabilityOutput = z.infer<typeof CheckRecipeViabilityOutputSchema>;

export async function checkRecipeViability(input: CheckRecipeViabilityInput): Promise<CheckRecipeViabilityOutput> {
  return checkRecipeViabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkRecipeViabilityPrompt',
  input: {schema: CheckRecipeViabilityInputSchema},
  output: {schema: CheckRecipeViabilityOutputSchema},
  prompt: `You are an expert culinary advisor that rates the recipe viability based on the recipe name, ingredients, and instructions. 

Recipe Name: {{{recipeName}}}
Ingredients: {{{ingredients}}}
Instructions: {{{instructions}}}

You will make a determination as to whether the recipe is viable or not, and set the isViable output field appropriately.
If the recipe is not viable, you will provide reasoning and suggestions for improvement.`,
});

const checkRecipeViabilityFlow = ai.defineFlow(
  {
    name: 'checkRecipeViabilityFlow',
    inputSchema: CheckRecipeViabilityInputSchema,
    outputSchema: CheckRecipeViabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
