import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import { Link } from '@/lib/navigation';

export default function Home() {
  const t = useTranslations();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted/20 py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                {t('home.hero.title')}
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  href="/subscribe"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {t('home.hero.cta1')}
                </Link>
                <Link
                  href="/submit"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {t('home.hero.cta2')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">{t('home.categories.title')}</h2>
              <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
                {t('home.categories.viewAll')}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Category placeholders */}
              {Object.entries(t.raw('tools.categories')).map(([key, value]) => (
                <Link 
                  key={key} 
                  href={`/tools/${key}`}
                  className="group relative overflow-hidden rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold">{value as string}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {/* Placeholder for category description */}
                    {t('tools.filters.all')} {value as string}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tools Section */}
        <section className="py-12 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">{t('home.featured.title')}</h2>
              <Link href="/tools" className="text-sm font-medium text-primary hover:underline">
                {t('home.featured.viewAll')}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Tool card placeholders */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                  <div className="absolute top-2 right-2 z-10">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {t('tools.card.pick')}
                    </span>
                  </div>
                  <Link href="#" className="block p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-muted"></div>
                      <h3 className="font-semibold">{`Tool ${item}`}</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs">
                        Tag 1
                      </span>
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs">
                        Tag 2
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">{t('home.blog.title')}</h2>
              <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
                {t('home.blog.viewAll')}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Blog post placeholders */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted"></div>
                  <div className="p-4">
                    <h3 className="font-semibold">{`Blog Post ${item}`}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">April 21, 2025</span>
                      <Link href="#" className="text-xs font-medium text-primary hover:underline">
                        {t('home.blog.readMore')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/20">
        <div className="container px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
              <div className="flex max-w-md">
                <input
                  type="email"
                  placeholder={t('footer.newsletterPlaceholder')}
                  className="flex-1 h-10 rounded-l-md border border-input bg-background px-3 py-2 text-sm"
                />
                <button className="inline-flex h-10 items-center justify-center rounded-r-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                  {t('footer.subscribe')}
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('common.navigation.tools')}</h3>
              <ul className="space-y-2">
                {Object.entries(t.raw('tools.categories')).slice(0, 4).map(([key, value]) => (
                  <li key={key}>
                    <Link href={`/tools/${key}`} className="text-sm hover:underline">
                      {value as string}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('common.navigation.about')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm hover:underline">
                    {t('common.navigation.about')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm hover:underline">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm hover:underline">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  );
}
