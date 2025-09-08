
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import {
  Loader2,
  Sparkles,
  UtensilsCrossed,
  Bookmark,
  Clock,
  BarChart,
  Globe,
  Copy,
  Flame,
  Salad,
  Wheat,
  Beef,
  CookingPot,
  Star,
} from 'lucide-react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

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
import {
  generateRecipeAction,
  generateRecipeVariationAction,
} from '@/app/actions';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import {
  recipeGenerationSchema,
  recipeVariationSchema,
  type RecipeGenerationValues,
  type RecipeVariationValues,
} from '@/lib/schemas';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

function RecipeInfoBadges({ recipe }: { recipe: GenerateRecipeOutput }) {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
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

function NutritionalInfoDisplay({
  nutritionalInfo,
}: {
  nutritionalInfo: GenerateRecipeOutput['nutritionalInfo'];
}) {
  return (
    <div>
      <h3 className="text-xl font-bold font-headline mt-4 mb-2">
        Nutritional Information
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <Card className="p-4 bg-secondary/50">
          <Flame className="h-6 w-6 text-accent mx-auto mb-1" />
          <p className="font-bold text-lg">{nutritionalInfo.calories}</p>
          <p className="text-xs text-muted-foreground">Calories</p>
        </Card>
        <Card className="p-4 bg-secondary/50">
          <Beef className="h-6 w-6 text-accent mx-auto mb-1" />
          <p className="font-bold text-lg">{nutritionalInfo.protein}</p>
          <p className="text-xs text-muted-foreground">Protein</p>
        </Card>
        <Card className="p-4 bg-secondary/50">
          <Wheat className="h-6 w-6 text-accent mx-auto mb-1" />
          <p className="font-bold text-lg">{nutritionalInfo.carbs}</p>
          <p className="text-xs text-muted-foreground">Carbs</p>
        </Card>
        <Card className="p-4 bg-secondary/50">
          <Salad className="h-6 w-6 text-accent mx-auto mb-1" />
          <p className="font-bold text-lg">{nutritionalInfo.fat}</p>
          <p className="text-xs text-muted-foreground">Fat</p>
        </Card>
      </div>
    </div>
  );
}

function UserFeedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Feedback Submitted!',
      description: 'Thank you for your feedback.',
    });
    setRating(0);
    setHoverRating(0);
    setFeedback('');
  };

  return (
    <div className="mt-6">
      <Separator className="my-6" />
      <h3 className="text-xl font-bold font-headline mb-4">
        Rate this Recipe
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Your Rating:</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  type="button"
                  key={starValue}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      'h-6 w-6 transition-colors',
                      starValue <= (hoverRating || rating)
                        ? 'text-primary fill-primary'
                        : 'text-muted-foreground/50'
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label htmlFor="feedback" className="sr-only">
            Your Feedback
          </Label>
          <Textarea
            id="feedback"
            placeholder="Share your experience or suggestions..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="secondary">
            Submit Feedback
          </Button>
        </div>
      </form>
    </div>
  );
}

function RecipeVariations({
  originalRecipe,
}: {
  originalRecipe: GenerateRecipeOutput;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [variationRecipe, setVariationRecipe] =
    useState<GenerateRecipeOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<RecipeVariationValues>({
    resolver: zodResolver(recipeVariationSchema),
    defaultValues: {
      variation: '',
    },
  });

  const onSubmit = async (values: RecipeVariationValues) => {
    setIsLoading(true);
    setVariationRecipe(null);
    const result = await generateRecipeVariationAction({
      recipe: originalRecipe,
      variation: values.variation,
    });

    if (result.success) {
      setVariationRecipe(result.data);
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
    <div className="mt-6">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Want to Change Something? Get Recipe Variations
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 mt-2 border rounded-lg bg-background">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="variation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variation Request</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Make it vegan, gluten-free, spicier..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Variation...
                    </>
                  ) : (
                    <>
                      <CookingPot className="mr-2 h-4 w-4" />
                      Generate Variation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {isLoading && <LoadingSkeleton />}
          {variationRecipe && (
            <div className="mt-6">
              <h3 className="text-xl font-bold font-headline mb-4 text-center">
                Your Recipe Variation
              </h3>
              <RecipeDisplay recipe={variationRecipe} isVariation />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function RecipeDisplay({
  recipe,
  isVariation = false,
}: {
  recipe: GenerateRecipeOutput;
  isVariation?: boolean;
}) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSaveRecipe = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to save a recipe.',
      });
      router.push('/login');
      return;
    }
    setIsSaving(true);
    try {
      const recipesRef = collection(db, 'users', user.uid, 'recipes');
      const q = query(recipesRef, where('recipeName', '==', recipe.recipeName));
      const existing = await getDocs(q);

      if (!existing.empty) {
        toast({
          variant: 'destructive',
          title: 'Already Saved',
          description: 'This recipe is already in your saved list.',
        });
        return;
      }

      await addDoc(recipesRef, recipe);
      toast({
        title: 'Recipe Saved!',
        description: `'${recipe.recipeName}' has been added to your saved recipes.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save recipe. Please try again.',
      });
      console.error('Failed to save recipe to Firestore:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyRecipe = () => {
    const recipeText = `
Recipe: ${recipe.recipeName}

Cuisine: ${recipe.cuisine}
Difficulty: ${recipe.difficulty}
Cooking Time: ${recipe.cookingTime}

Nutritional Info:
- Calories: ${recipe.nutritionalInfo.calories}
- Protein: ${recipe.nutritionalInfo.protein}
- Carbs: ${recipe.nutritionalInfo.carbs}
- Fat: ${recipe.nutritionalInfo.fat}

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

  return (
    <Card
      className={`mt-8 shadow-lg animate-in fade-in-50 duration-500 ${
        isVariation ? 'bg-card/90 border-primary' : ''
      }`}
    >
      <CardHeader>
        {recipe.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden shadow-inner">
            <Image
              src={recipe.imageUrl}
              alt={`An image of ${recipe.recipeName}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              data-ai-hint="recipe food"
            />
          </div>
        )}
        <CardTitle className="text-3xl font-headline text-accent">
          {recipe.recipeName}
        </CardTitle>
        <CardDescription>
          Here is your unique, AI-generated recipe. Enjoy your cooking!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RecipeInfoBadges recipe={recipe} />
        <Separator />
        <div>
          <h3 className="text-xl font-bold font-headline mt-4 mb-2">
            Ingredients
          </h3>
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
        <Separator />
        <NutritionalInfoDisplay nutritionalInfo={recipe.nutritionalInfo} />
        <UserFeedback />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button onClick={handleSaveRecipe} disabled={isSaving}>
          <Bookmark className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Recipe'}
        </Button>
        <Button variant="outline" onClick={handleCopyRecipe}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Recipe
        </Button>
      </CardFooter>
      {!isVariation && <RecipeVariations originalRecipe={recipe} />}
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 rounded-md mt-4" />
        <Skeleton className="h-4 w-1/2 rounded-md mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Separator />
        <div>
          <Skeleton className="h-6 w-1/4 rounded-md mb-4 mt-4" />
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
        <Separator />
        <div>
          <Skeleton className="h-6 w-1/2 rounded-md mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RecipeGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] =
    useState<GenerateRecipeOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<RecipeGenerationValues>({
    resolver: zodResolver(recipeGenerationSchema),
    defaultValues: {
      ingredients: '',
      customization: '',
    },
  });

  const onSubmit = async (values: RecipeGenerationValues) => {
    setIsLoading(true);
    setGeneratedRecipe(null);
    const result = await generateRecipeAction(values);

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
            Your Kitchen
          </CardTitle>
          <CardDescription>
            List your ingredients and any special requests below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List all ingredients, separated by commas..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Dietary Needs or Special Requests (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Vegan, gluten-free, low-carb, for kids..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
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
