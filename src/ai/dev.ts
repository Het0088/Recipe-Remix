import { config } from 'dotenv';
config();

import '@/ai/flows/generate-recipe.ts';
import '@/ai/flows/check-recipe-viability.ts';
import '@/ai/flows/generate-recipe-image.ts';
import '@/ai/flows/generate-recipe-variation.ts';
import '@/ai/flows/generate-recipe-of-the-day.ts';
