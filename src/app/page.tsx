import RecipeGeneration from '@/components/recipe-generation';

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          Unleash Your Inner Chef
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Got a few ingredients but not sure what to make? Let our AI chef whip up a unique and delicious recipe just for you.
        </p>
      </div>

      <RecipeGeneration />
    </div>
  );
}
