'use server';

import { generateRecipe } from '@/ai/flows/generate-recipe';
import { checkRecipeViability } from '@/ai/flows/check-recipe-viability';

export async function generateRecipeAction(data: { ingredients: string[] }) {
  try {
    const result = await generateRecipe({ ingredients: data.ingredients });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate recipe. Please try again.' };
  }
}

export async function checkViabilityAction(data: {
  recipeName: string;
  ingredients: string;
  instructions: string;
}) {
  try {
    const result = await checkRecipeViability(data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to check recipe viability. Please try again.',
    };
  }
}
