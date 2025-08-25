'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getRecipeOfTheDay } from '@/app/actions';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Clock, BarChart, Globe, Utensils, AlertTriangle } from 'lucide-react';
import { Separator } from './ui/separator';

function RecipeInfoBadges({ recipe }: { recipe: GenerateRecipeOutput }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {recipe.cookingTime}
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <BarChart className="h-3 w-3" />
        {recipe.difficulty}
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <Globe className="h-3 w-3" />
        {recipe.cuisine}
      </Badge>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="shadow-lg animate-pulse">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md mt-2" />
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <Card className="shadow-lg border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle />
          Something Went Wrong
        </CardTitle>
        <CardDescription>
          We couldn't fetch the Recipe of the Day. Please try again later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-destructive/80">{error}</p>
      </CardContent>
    </Card>
  );
}

export default function RecipeOfTheDay() {
  const [recipe, setRecipe] = useState<GenerateRecipeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getRecipeOfTheDay();
      if (result.success) {
        setRecipe(result.data);
      } else {
        setError(result.error ?? 'An unknown error occurred.');
      }
      setIsLoading(false);
    };

    fetchRecipe();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!recipe) {
    return null;
  }

  return (
    <Card className="shadow-xl bg-card/70 backdrop-blur-sm animate-in fade-in duration-500">
      <CardHeader className="text-center">
        <h2 className="text-sm font-semibold text-accent tracking-widest uppercase">
          Recipe of the Day
        </h2>
        <CardTitle className="text-3xl md:text-4xl font-headline text-primary">
          {recipe.recipeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          {recipe.imageUrl && (
            <Image
              src={recipe.imageUrl}
              alt={`An image of ${recipe.recipeName}`}
              width={400}
              height={400}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              data-ai-hint="recipe food"
            />
          )}
        </div>
        <div className="md:col-span-2 space-y-4">
          <RecipeInfoBadges recipe={recipe} />
          <div>
            <h3 className="text-lg font-bold font-headline mb-2 flex items-center gap-2">
              <Utensils className="text-accent" />
              Ingredients
            </h3>
            <ul className="list-disc list-inside space-y-1 text-foreground/90 text-sm pl-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <Separator />
           <div>
            <h3 className="text-lg font-bold font-headline mb-2">Instructions</h3>
            <p className="whitespace-pre-line leading-relaxed text-foreground/90 text-sm">
              {recipe.instructions.length > 300
                ? `${recipe.instructions.substring(0, 300)}...`
                : recipe.instructions}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
