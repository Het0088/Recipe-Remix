// This file holds the Genkit flow for generating the "Recipe of the Day".

'use server';

/**
 * @fileOverview Recipe of the Day generation AI agent.
 *
 * - generateRecipeOfTheDay - A function that generates a daily recipe.
 * - GenerateRecipeOutput - The return type for the generateRecipeOfTheDay function.
 */

import { ai } from '@/ai/genkit';
import { GenerateRecipeOutputSchema } from '@/ai/schemas';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import { z } from 'zod';

export type GenerateRecipeOfTheDayOutput = GenerateRecipeOutput;

export async function generateRecipeOfTheDay(): Promise<GenerateRecipeOfTheDayOutput> {
  return generateRecipeOfTheDayFlow();
}

const prompt = ai.definePrompt({
  name: 'generateRecipeOfTheDayPrompt',
  output: { schema: GenerateRecipeOutputSchema.omit({ imageUrl: true }) },
  prompt: `You are a chef responsible for creating a "Recipe of the Day" for a popular cooking website.

  Your task is to generate a single, appealing, and relatively simple recipe that a home cook could make.
  It should be interesting and sound delicious. Consider seasonality if you can.
  
  The recipe should include a name, a list of ingredients, and detailed instructions.
  Also include the difficulty level (Easy, Medium, or Hard), the estimated cooking time, and the cuisine type.
  Provide an estimated nutritional information breakdown per serving, including calories, protein, carbs, and fat.
  `,
});

const generateRecipeOfTheDayFlow = ai.defineFlow(
  {
    name: 'generateRecipeOfTheDayFlow',
    outputSchema: GenerateRecipeOutputSchema,
  },
  async () => {
    const { output: recipeOutput } = await prompt({});

    if (!recipeOutput) {
      throw new Error('Recipe generation failed.');
    }

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A delicious-looking, professionally photographed image of "${recipeOutput.recipeName}", with a clean, bright background.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed.');
    }

    return {
      ...recipeOutput,
      imageUrl: media.url,
    };
  }
);
