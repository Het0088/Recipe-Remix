import CheckViability from '@/components/check-viability';

export default function CheckViabilityPage() {
  return (
    <div className="flex-1">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
            Check Your Recipe's Viability
          </h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Got a recipe idea? Let our AI chef take a look and give you feedback on its viability. (Coming Soon!)
          </p>
        </div>
        <CheckViability />
      </div>
    </div>
  );
}
