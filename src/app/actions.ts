'use server';

import { generateRecipe } from '@/ai/flows/generate-recipe';

export async function generateRecipeAction(data: { ingredients: string[] }) {
  try {
    const result = await generateRecipe({ ingredients: data.ingredients });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate recipe. Please try again.' };
  }
}
