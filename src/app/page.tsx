import RecipeGeneration from '@/components/recipe-generation';
import RecipeOfTheDay from '@/components/recipe-of-the-day';

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <RecipeOfTheDay />
      <div className="text-center my-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          Unleash Your Inner Chef
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Got a few ingredients and no ideas? Let our AI whip up a unique and
          delicious recipe for you. Just enter what you have, and get ready to
          create something amazing.
        </p>
      </div>

      <RecipeGeneration />
    </div>
  );
}
