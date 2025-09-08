
'use server';

import { generateRecipe } from '@/ai/flows/generate-recipe';
import { checkRecipeViability } from '@/ai/flows/check-recipe-viability';
import { generateRecipeImage } from '@/ai/flows/generate-recipe-image';
import { generateRecipeVariation } from '@/ai/flows/generate-recipe-variation';
import type {
  RecipeGenerationValues,
  RecipeViabilityValues,
} from '@/lib/schemas';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';

export async function generateRecipeAction(data: RecipeGenerationValues) {
  try {
    const ingredients = data.ingredients.split(',').map((i) => i.trim()).filter(Boolean);
    const result = await generateRecipe({
      ingredients,
      customization: data.customization,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to generate recipe. Please try again.',
    };
  }
}

export async function checkRecipeViabilityAction(data: RecipeViabilityValues) {
  // try {
  //   const result = await checkRecipeViability(data);
  //   return { success: true, data: result };
  // } catch (error) {
  //   console.error(error);
    return {
      success: false,
      error: 'This feature is coming soon!',
    };
  // }
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
    return {
      success: false,
      error: 'Failed to generate variation. Please try again.',
    };
  }
}
