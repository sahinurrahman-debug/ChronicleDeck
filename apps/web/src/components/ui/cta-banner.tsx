import * as React from "react";

/** Full-width call to action in the brand colour (brown in light mode, cream in dark mode). */
export function CtaBanner({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground shadow-lift sm:px-12 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/10"
      />
      <div className="relative flex flex-wrap items-center justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg text-primary-foreground/80">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">{actions}</div>
      </div>
    </section>
  );
}
