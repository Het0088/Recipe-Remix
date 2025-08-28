import RecipeGeneration from '@/components/recipe-generation';

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          Turn Your Ingredients into Dinner
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          For busy home cooks, students, and anyone looking to reduce food waste.
          Tell us what you have in your kitchen, and our AI will whip up a unique and
          delicious recipe for you.
        </p>
      </div>

      <RecipeGeneration />
    </div>
  );
}
