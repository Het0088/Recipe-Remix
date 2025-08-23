'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import SavedRecipes from '@/components/saved-recipes';
import { Loader2 } from 'lucide-react';

export default function SavedRecipesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/saved-recipes');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="flex-1 flex items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin" />
       </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="bg-background min-h-full">
        <div className="container mx-auto max-w-4xl py-12 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
              Your Saved Recipes
            </h1>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Here are the culinary gems you've saved for later.
            </p>
          </div>
          <SavedRecipes />
        </div>
      </div>
    </div>
  );
}
