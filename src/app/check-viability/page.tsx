import ViabilityCheckForm from '@/components/viability-check-form';

export default function CheckViabilityPage() {
  return (
    <div>
      <div className="bg-background">
        <div className="container mx-auto max-w-4xl py-12 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
              Is Your Recipe a Winner?
            </h1>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Got a recipe idea or found one online? Paste it here, and our AI
              culinary expert will check if it makes sense, providing helpful
              feedback and suggestions.
            </p>
          </div>

          <ViabilityCheckForm />
        </div>
      </div>
    </div>
  );
}
