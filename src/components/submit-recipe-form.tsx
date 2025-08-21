'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send, FileText, Drumstick, ClipboardCheck } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import { submitRecipeAction } from '@/app/actions';

export default function SubmitRecipeForm() {
  const [isLoading, setIsLoading] = useState(false);
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
    const result = await submitRecipeAction(values);

    if (result.success && result.data?.wasViable) {
      toast({
        title: 'Recipe Submitted!',
        description:
          'Thank you for sharing your recipe with the community.',
      });
      form.reset();
    } else if(result.success && !result.data?.wasViable) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: "Your recipe was not considered viable by our AI. Please try again with a different recipe."
      });
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
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Your Recipe</CardTitle>
        <CardDescription>
          Fill out the form below to submit your recipe.
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
                    <Input
                      placeholder="e.g., Spicy Thai Green Curry"
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
                  <FormLabel className="flex items-center gap-2">
                    <Drumstick className="h-4 w-4" /> Ingredients
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List each ingredient on a new line for clarity."
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
                      placeholder="Provide the step-by-step instructions for your recipe."
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
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Recipe
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
