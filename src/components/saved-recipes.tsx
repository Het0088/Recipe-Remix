'use client';

import { useState, useEffect } from 'react';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import {
  Trash2,
  Clock,
  BarChart,
  Globe,
  Copy,
  Flame,
  Beef,
  Wheat,
  Salad,
  Star,
  MessageSquareQuote,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function RecipeInfoBadges({ recipe }: { recipe: GenerateRecipeOutput }) {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      {recipe.cookingTime && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {recipe.cookingTime}
        </Badge>
      )}
      {recipe.difficulty && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <BarChart className="h-3 w-3" />
          {recipe.difficulty}
        </Badge>
      )}
      {recipe.cuisine && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          {recipe.cuisine}
        </Badge>
      )}
    </div>
  );
}

function NutritionalInfoDisplay({
  nutritionalInfo,
}: {
  nutritionalInfo?: GenerateRecipeOutput['nutritionalInfo'];
}) {
  if (!nutritionalInfo) return null;

  return (
    <div>
      <h3 className="text-xl font-bold font-headline mt-4 mb-2">
        Nutritional Information
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <Card className="p-4 bg-secondary/50">
          <Flame className="h-6 w-6 text-primary mx-auto mb-1" />
          <p className="font-bold text-lg">{nutritionalInfo.calories}</p>
          <p className="text-xs text-muted-foreground">Calories</p>
        </Card>
        <Card className="p-4 bg-secondary/50">
          <Beef className="h-6 w-6 text-primary mx-auto mb-1" />
          <p className="font-bold text-lg">{nutritionalInfo.protein}</p>
          <p className="text-xs text-muted-foreground">Protein</p>
        </Card>
        <Card className="p-4 bg-secondary/50">
          <Wheat className="h-6 w-6 text-primary mx-auto mb-1" />
          <p className="font-bold text-lg">{nutritionalInfo.carbs}</p>
          <p className="text-xs text-muted-foreground">Carbs</p>
        </Card>
        <Card className="p-4 bg-secondary/50">
          <Salad className="h-6 w-6 text-primary mx-auto mb-1" />
          <p className="font-bold text-lg">{nutritionalInfo.fat}</p>
          <p className="text-xs text-muted-foreground">Fat</p>
        </Card>
      </div>
    </div>
  );
}

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<GenerateRecipeOutput[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // try {
    //   const recipesFromStorage = JSON.parse(
    //     localStorage.getItem('savedRecipes') || '[]'
    //   );
    //   setSavedRecipes(recipesFromStorage);
    // } catch (error) {
    //   console.error('Failed to load recipes from local storage:', error);
    //   setSavedRecipes([]);
    // }
  }, []);

  const handleRemoveRecipe = (recipeName: string) => {
    const updatedRecipes = savedRecipes.filter(
      (r) => r.recipeName !== recipeName
    );
    setSavedRecipes(updatedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
  };

  const handleClearAll = () => {
    setSavedRecipes([]);
    localStorage.removeItem('savedRecipes');
  };

  const handleCopyRecipe = (recipe: GenerateRecipeOutput) => {
    const nutritionalInfoText = recipe.nutritionalInfo
      ? `
Nutritional Info:
- Calories: ${recipe.nutritionalInfo.calories}
- Protein: ${recipe.nutritionalInfo.protein}
- Carbs: ${recipe.nutritionalInfo.carbs}
- Fat: ${recipe.nutritionalInfo.fat}
`
      : '';
    
    const recipeText = `
Recipe: ${recipe.recipeName}

Cuisine: ${recipe.cuisine}
Difficulty: ${recipe.difficulty}
Cooking Time: ${recipe.cookingTime}
${nutritionalInfoText}
Ingredients:
${recipe.ingredients.join('\n')}

Instructions:
${recipe.instructions}
    `;
    navigator.clipboard.writeText(recipeText.trim());
    toast({
      title: 'Recipe Copied!',
      description: 'The recipe has been copied to your clipboard.',
    });
  };

  if (!isClient) {
    // Render a loading state or nothing on the server
    return null;
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-card/80 rounded-lg shadow-inner">
        <h2 className="text-2xl font-headline text-primary">
          No Recipes Saved Yet
        </h2>
        <p className="text-foreground/70 mt-2">
          Go to the 'Generate Recipe' page to create and save new recipes!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-right">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                your saved recipes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAll}>
                Yes, delete all
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {savedRecipes.map((recipe, index) => (
        <Card key={index} className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-accent">
              {recipe.recipeName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RecipeInfoBadges recipe={recipe} />
            <Separator />
            <div>
              <h3 className="text-xl font-bold font-headline mt-4 mb-2">
                Ingredients
              </h3>
              <ul className="list-disc list-inside space-y-1 text-foreground/90">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline mb-2">
                Instructions
              </h3>
              <p className="whitespace-pre-line leading-relaxed text-foreground/90">
                {recipe.instructions}
              </p>
            </div>
            {recipe.nutritionalInfo && <Separator />}
            <NutritionalInfoDisplay nutritionalInfo={recipe.nutritionalInfo} />
          </CardContent>
          <CardFooter className="justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveRecipe(recipe.recipeName)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyRecipe(recipe)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Recipe
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
