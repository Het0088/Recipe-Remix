// This file holds the Genkit flow for checking the viability of a user-submitted recipe.

'use server';

/**
 * @fileOverview Recipe viability checking AI agent.
 *
 * - checkRecipeViability - A function that checks if a recipe is viable.
 * - CheckRecipeViabilityInput - The input type for the checkRecipeViability function.
 * - CheckRecipeViabilityOutput - The return type for the checkRecipeViability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckRecipeViabilityInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to check.'),
  ingredients: z.string().describe('The list of ingredients for the recipe.'),
  instructions: z.string().describe('The cooking instructions for the recipe.'),
});
export type CheckRecipeViabilityInput = z.infer<
  typeof CheckRecipeViabilityInputSchema
>;

const CheckRecipeViabilityOutputSchema = z.object({
  isViable: z
    .boolean()
    .describe('Whether the recipe is considered viable or not.'),
  feedback: z
    .string()
    .describe(
      'Feedback on the recipe, explaining why it is or is not viable and suggesting improvements.'
    ),
  score: z
    .number()
    .describe(
      'A score from 0 to 10 indicating the viability of the recipe.'
    ),
});
export type CheckRecipeViabilityOutput = z.infer<
  typeof CheckRecipeViabilityOutputSchema
>;

export async function checkRecipeViability(
  input: CheckRecipeViabilityInput
): Promise<CheckRecipeViabilityOutput> {
  return checkRecipeViabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkRecipeViabilityPrompt',
  input: {schema: CheckRecipeViabilityInputSchema},
  output: {schema: CheckRecipeViabilityOutputSchema},
  prompt: `You are an expert chef who is judging a recipe contest.
Evaluate the following recipe and determine if it is viable.
A viable recipe should be logical, have ingredients that work well together, and have clear instructions.

Recipe Name: {{{recipeName}}}
Ingredients: {{{ingredients}}}
Instructions: {{{instructions}}}

Provide a score from 0 to 10 for the recipe's viability.
- A score of 0-3 means the recipe is not viable and has significant flaws.
- A score of 4-6 means the recipe has potential but needs improvement.
- A score of 7-9 means the recipe is good and well-constructed.
- A score of 10 means the recipe is excellent and creative.

Set the isViable field to true if the score is 7 or higher, and false otherwise.
Provide constructive feedback explaining your reasoning and suggest improvements if necessary. Be encouraging but honest.
  `,
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
