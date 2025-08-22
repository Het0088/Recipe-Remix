'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Minus, Plus, Sparkles, UtensilsCrossed, Bookmark } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateRecipeAction } from '@/app/actions';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import {
  recipeGenerationSchema,
  type RecipeGenerationValues,
} from '@/lib/schemas';
import { Skeleton } from './ui/skeleton';

function RecipeDisplay({ recipe }: { recipe: GenerateRecipeOutput }) {
  const { toast } = useToast();
  const handleSaveRecipe = () => {
    try {
      const savedRecipes: GenerateRecipeOutput[] = JSON.parse(
        localStorage.getItem('savedRecipes') || '[]'
      );
      // Avoid saving duplicates
      if (!savedRecipes.some((r) => r.recipeName === recipe.recipeName)) {
        savedRecipes.push(recipe);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        toast({
          title: 'Recipe Saved!',
          description: `'${recipe.recipeName}' has been added to your saved recipes.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Already Saved',
          description: 'This recipe is already in your saved list.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save recipe. Please try again.',
      });
      console.error('Failed to save recipe to local storage:', error);
    }
  };

  return (
    <Card className="mt-8 shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-accent">
          {recipe.recipeName}
        </CardTitle>
        <CardDescription>
          Here is your unique, AI-generated recipe. Enjoy your cooking!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-bold font-headline mb-2">Ingredients</h3>
          <ul className="list-disc list-inside space-y-1 text-foreground/90">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold font-headline mb-2">Instructions</h3>
          <p className="whitespace-pre-line leading-relaxed text-foreground/90">
            {recipe.instructions}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveRecipe} variant="outline">
          <Bookmark className="mr-2 h-4 w-4" />
          Save Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}

function LoadingSkeleton() {
    return (
        <Card className="mt-8 shadow-lg">
            <CardHeader>
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Skeleton className="h-6 w-1/4 rounded-md mb-4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-5/6 rounded-md" />
                        <Skeleton className="h-4 w-full rounded-md" />
                    </div>
                </div>
                <div>
                    <Skeleton className="h-6 w-1/3 rounded-md mb-4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-5/6 rounded-md" />
                        <Skeleton className="h-4 w-full rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function RecipeGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] =
    useState<GenerateRecipeOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<RecipeGenerationValues>({
    resolver: zodResolver(recipeGenerationSchema),
    defaultValues: {
      ingredients: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ingredients',
  });

  const onSubmit = async (values: RecipeGenerationValues) => {
    setIsLoading(true);
    setGeneratedRecipe(null);
    const ingredients = values.ingredients.map((i) => i.value);
    const result = await generateRecipeAction({ ingredients });

    if (result.success) {
      setGeneratedRecipe(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <UtensilsCrossed className="text-primary" />
            Your Ingredients
          </CardTitle>
          <CardDescription>
            List the ingredients you have on hand. Add as many as you like!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`ingredients.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
                          Ingredient {index + 1}
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              placeholder={`e.g., Tofu, tomatoes, ...`}
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Minus className="h-4 w-4" />
                            <span className="sr-only">Remove ingredient</span>
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ value: '' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Ingredient
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground flex-grow"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Recipe
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <LoadingSkeleton />}
      {generatedRecipe && <RecipeDisplay recipe={generatedRecipe} />}
    </>
  );
}
