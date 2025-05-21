import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';

type HeroSectionProps = {
  title: string;
  subtitle: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
};

export default function HeroSection({
  title,
  subtitle,
  cta1Text,
  cta1Link,
  cta2Text,
  cta2Link
}: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-background to-muted/20 py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href={cta1Link}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {cta1Text}
            </Link>
            <Link
              href={cta2Link}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {cta2Text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
