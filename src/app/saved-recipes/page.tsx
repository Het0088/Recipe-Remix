import SavedRecipes from '@/components/saved-recipes';

export default function SavedRecipesPage() {
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
