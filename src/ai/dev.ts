import { config } from 'dotenv';
config();

import '@/ai/flows/check-recipe-viability.ts';
import '@/ai/flows/generate-recipe.ts';
import '@/ai/flows/submit-recipe.ts';
