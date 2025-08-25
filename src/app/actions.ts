'use server';

import { generateRecipe } from '@/ai/flows/generate-recipe';
import { checkRecipeViability } from '@/ai/flows/check-recipe-viability';
import { generateRecipeImage } from '@/ai/flows/generate-recipe-image';
import { generateRecipeVariation } from '@/ai/flows/generate-recipe-variation';
import type { RecipeViabilityValues } from '@/lib/schemas';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';

export async function generateRecipeAction(data: { ingredients: string[], customization?: string }) {
  try {
    const result = await generateRecipe(data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate recipe. Please try again.' };
  }
}

export async function checkRecipeViabilityAction(data: RecipeViabilityValues) {
  try {
    const result = await checkRecipeViability(data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to check recipe viability. Please try again.' };
  }
}

export async function generateRecipeImageAction(data: { recipeName: string }) {
  try {
    const result = await generateRecipeImage(data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate image. Please try again.' };
  }
}

export async function generateRecipeVariationAction(data: {
  recipe: GenerateRecipeOutput;
  variation: string;
}) {
  try {
    const result = await generateRecipeVariation(data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate variation. Please try again.' };
  }
}
