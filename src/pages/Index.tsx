import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layers, Palette, Zap, Globe, Loader2, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">PageCraft</h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-left">PageCraft</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <Button variant="ghost" className="justify-start" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                  <Button className="justify-start" onClick={() => navigate('/auth')}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="px-4 py-16 md:py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="animate-fade-in text-4xl font-bold leading-tight text-foreground sm:text-6xl">
              Build beautiful pages
              <br />
              <span className="text-primary">in minutes</span>
            </h2>
            <p className="mt-6 animate-fade-in text-lg text-muted-foreground">
              Create stunning link pages, photo galleries, and documents.
              <br />
              No coding required. Just pick a template and customize.
            </p>
            <div className="mt-8 flex justify-center gap-4 animate-slide-up">
              <Button size="lg" onClick={() => navigate('/auth')}>
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Examples
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/50 bg-secondary/30 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h3 className="mb-12 text-center text-2xl md:text-3xl font-bold text-foreground">
              Everything you need to create
            </h3>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<Layers className="h-6 w-6" />}
                title="Templates"
                description="Choose from beautiful pre-designed templates for any purpose"
              />
              <FeatureCard
                icon={<Palette className="h-6 w-6" />}
                title="Customize"
                description="Easily customize colors, fonts, and content to match your style"
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Fast"
                description="Your pages load instantly with optimized performance"
              />
              <FeatureCard
                icon={<Globe className="h-6 w-6" />}
                title="Publish"
                description="Share your page with a unique URL in one click"
              />
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h3 className="mb-12 text-center text-2xl md:text-3xl font-bold text-foreground">
              Create what you need
            </h3>
            <div className="grid gap-6 sm:grid-cols-3">
              <CategoryPreview
                emoji="🔗"
                title="Link Pages"
                description="Share all your important links in one beautiful page"
              />
              <CategoryPreview
                emoji="🖼️"
                title="Photo Galleries"
                description="Showcase your photos in stunning grid layouts"
              />
              <CategoryPreview
                emoji="📝"
                title="Letters & Docs"
                description="Share letters, announcements, or any written content"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/50 bg-primary/5 px-4 py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-3xl font-bold text-foreground">
              Ready to create your page?
            </h3>
            <p className="mt-4 text-muted-foreground">
              Join thousands of creators building beautiful pages with PageCraft.
            </p>
            <Button size="lg" className="mt-8" onClick={() => navigate('/auth')}>
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>© 2026 PageCraft. Build beautiful pages.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h4 className="mb-2 font-semibold text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function CategoryPreview({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="mb-4 text-5xl">{emoji}</div>
      <h4 className="mb-2 text-xl font-semibold text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
