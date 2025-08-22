import SavedRecipes from '@/components/saved-recipes';

export default function SavedRecipesPage() {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat flex-1"
      style={{
        backgroundImage: "url('https://placehold.co/1920x1080.png')",
      }}
      data-ai-hint="recipe book shelf"
    >
      <div className="bg-background/80 backdrop-blur-sm min-h-full">
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
