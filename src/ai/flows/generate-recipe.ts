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
  customization: z.string().optional().describe('An optional user request for customizing the recipe, e.g., "make it vegan", "gluten-free", "low-carb".'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema.omit({imageUrl: true})},
  prompt: `You are a chef specializing in creating unique recipes.

  Create a recipe based on the following ingredients: {{{ingredients}}}.
  {{#if customization}}
  The user has requested the following customization: "{{{customization}}}". You must adhere to this request.
  {{/if}}
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
    const {output: recipeOutput} = await prompt(input);
    
    if (!recipeOutput) {
      throw new Error('Recipe generation failed.');
    }

    return {
      ...recipeOutput,
      imageUrl: '', // Return empty string as image is disabled
    };
  }
);
