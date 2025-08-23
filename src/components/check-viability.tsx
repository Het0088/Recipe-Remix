'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, Wand2, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  recipeViabilitySchema,
  type RecipeViabilityValues,
} from '@/lib/schemas';
import { checkRecipeViabilityAction } from '@/app/actions';
import type { CheckRecipeViabilityOutput } from '@/ai/flows/check-recipe-viability';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

function ViabilityResultDisplay({
  result,
}: {
  result: CheckRecipeViabilityOutput;
}) {
  return (
    <Card className="mt-8 shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline text-accent">
              {result.isViable ? (
                <ThumbsUp className="text-green-500" />
              ) : (
                <ThumbsDown className="text-red-500" />
              )}
              Viability Check Results
            </CardTitle>
            <CardDescription>
              Our AI chef has reviewed your recipe.
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-3xl font-bold text-primary">{result.score}/10</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={result.score * 10} className="w-full h-3" />
        <div>
          <h3 className="text-lg font-bold font-headline mb-2">Feedback</h3>
          <p className="whitespace-pre-line leading-relaxed text-foreground/90">
            {result.feedback}
          </p>
        </div>
      </CardContent>
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
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

export default function CheckViability() {
  const [isLoading, setIsLoading] = useState(false);
  const [viabilityResult, setViabilityResult] =
    useState<CheckRecipeViabilityOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<RecipeViabilityValues>({
    resolver: zodResolver(recipeViabilitySchema),
    defaultValues: {
      recipeName: '',
      ingredients: '',
      instructions: '',
    },
  });

  const onSubmit = async (values: RecipeViabilityValues) => {
    setIsLoading(true);
    setViabilityResult(null);
    // const result = await checkRecipeViabilityAction(values);

    // if (result.success) {
    //   setViabilityResult(result.data);
    // } else {
    //   toast({
    //     variant: 'destructive',
    //     title: 'Error',
    //     description: result.error,
    //   });
    // }
    setIsLoading(false);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Wand2 className="text-primary" />
            Your Recipe Idea
          </CardTitle>
          <CardDescription>
            Enter the details of your recipe below to get AI-powered feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="recipeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Spicy Mango Tango Tacos"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List all ingredients, each on a new line..."
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
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the preparation steps in detail..."
                        className="min-h-[150px]"
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
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Check Viability
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <LoadingSkeleton />}
      {viabilityResult && <ViabilityResultDisplay result={viabilityResult} />}
    </>
  );
}
