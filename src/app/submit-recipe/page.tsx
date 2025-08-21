import SubmitRecipeForm from '@/components/submit-recipe-form';

export default function SubmitRecipePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          Share Your Culinary Creations
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Have a recipe you're proud of? Submit it to our community! Your
          creations help inspire others and contribute to training our AI for
          even better recipe generation in the future.
        </p>
      </div>
      <SubmitRecipeForm />
    </div>
  );
}
