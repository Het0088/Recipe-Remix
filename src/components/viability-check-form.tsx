'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  FileText,
  Drumstick,
  ClipboardCheck,
} from 'lucide-react';

import {
  recipeViabilitySchema,
  type RecipeViabilityValues,
} from '@/lib/schemas';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { checkViabilityAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { CheckRecipeViabilityOutput } from '@/ai/flows/check-recipe-viability';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

function ViabilityResult({ result }: { result: CheckRecipeViabilityOutput }) {
  const isViable = result.isViable;

  return (
    <Card className="mt-8 shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-accent">
          Viability Report
        </CardTitle>
        <CardDescription>
          Here's the analysis of the submitted recipe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert
          variant={isViable ? 'default' : 'destructive'}
          className={cn(isViable && 'bg-green-100/50 border-green-400')}
        >
          {isViable ? (
            <ThumbsUp className="h-4 w-4" />
          ) : (
            <ThumbsDown className="h-4 w-4" />
          )}
          <AlertTitle
            className={cn(
              'font-headline text-lg',
              isViable ? 'text-green-900' : 'text-destructive'
            )}
          >
            {isViable ? 'This recipe is viable!' : 'This recipe is not viable.'}
          </AlertTitle>
          <AlertDescription
            className={cn(isViable ? 'text-green-800' : 'text-destructive')}
          >
            {result.reasoning}
          </AlertDescription>
        </Alert>

        {result.suggestions && (
          <Alert className="bg-yellow-100/40 border-yellow-400">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle className="font-headline text-lg text-yellow-900">
              Suggestions for Improvement
            </AlertTitle>
            <AlertDescription className="text-yellow-800">
              {result.suggestions}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}


function LoadingSkeleton() {
    return (
        <Card className="mt-8 shadow-lg">
            <CardHeader>
                <Skeleton className="h-8 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                 <Skeleton className="h-20 w-full rounded-md" />
                 <Skeleton className="h-20 w-full rounded-md" />
            </CardContent>
        </Card>
    )
}


export default function ViabilityCheckForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CheckRecipeViabilityOutput | null>(null);
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
    setResult(null);
    const response = await checkViabilityAction(values);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Recipe Details</CardTitle>
          <CardDescription>
            Fill in the details of the recipe you want to check.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="recipeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Recipe Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Grandmas Famous Lasagna" {...field} />
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
                    <FormLabel className="flex items-center gap-2">
                      <Drumstick className="h-4 w-4" /> Ingredients
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List each ingredient, e.g., '1 lb ground beef, 1 box lasagna noodles...'"
                        className="min-h-[120px]"
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
                    <FormLabel className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4" /> Instructions
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide the step-by-step instructions..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Viability'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <LoadingSkeleton />}
      {result && <ViabilityResult result={result} />}
    </>
  );
}
