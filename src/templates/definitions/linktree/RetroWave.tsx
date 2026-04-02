import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { LinktreeData } from '@/types/builder';
import { ArrowUpRight, User, Sparkles, Palette, Settings2, Trash2, Plus } from 'lucide-react';
import { EditorProps } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ThemeControls } from '@/components/editor/ThemeControls';
import { BrandKitControls } from '@/components/editor/BrandKitControls';

interface RetroWaveProps {
  data: LinktreeData;
}

export default function RetroWave({ data }: RetroWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const { profile, links, theme } = data;
  const shadowIntensity = theme?.shadowIntensity ?? 50;
  const animationSpeed = theme?.animationSpeed ?? 1;

  useEffect(() => {
    if (!containerRef.current) return;
    const speed = 1 / animationSpeed;

    const ctx = gsap.context(() => {
      if (avatarRef.current) {
        gsap.fromTo(avatarRef.current,
          { scale: 0, rotate: -180 },
          { scale: 1, rotate: 0, duration: 0.8 * speed, ease: 'back.out(1.7)' }
        );
      }

      gsap.fromTo('.profile-text',
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.7 * speed,
          stagger: 0.15,
          delay: 0.4,
          ease: 'power3.out'
        }
      );

      if (linksRef.current) {
        const linkElements = linksRef.current.children;
        gsap.fromTo(linkElements,
          {
            x: 100,
            opacity: 0,
            scale: 0.9,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6 * speed,
            stagger: 0.1,
            delay: 0.6,
            ease: 'power2.out'
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [animationSpeed]);

  const backgroundStyle = useMemo(() => {
    const bg = theme?.background || '#2d0a4e';
    if (bg.includes('gradient') || bg.includes('linear')) {
      return { background: bg };
    }
    return { backgroundColor: bg };
  }, [theme?.background]);

  const getButtonStyle = () => {
    const base: React.CSSProperties = {
      backgroundColor: theme?.buttonColor || '#ff00ff',
      color: theme?.buttonTextColor || '#00ffff',
      borderRadius: '0px',
      boxShadow: `${6 * shadowIntensity / 100}px ${6 * shadowIntensity / 100}px 0 rgba(0,0,0,0.4)`,
      border: '3px solid currentColor',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
      fontWeight: 700,
    };
    return base;
  };

  return (
    <div
      ref={containerRef}
      className="min-h-full w-full relative overflow-hidden"
      style={{
        ...backgroundStyle,
        color: theme?.textColor || '#00ffff',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`
          }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,0,128,0.1) 50%, rgba(0,255,255,0.1) 100%)',
            transform: 'perspective(200px) rotateX(60deg)',
            transformOrigin: 'center bottom',
          }}
        />
      </div>

      <div className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-md text-center">
          {/* Avatar */}
          {profile?.avatar && (
            <div className="mb-6 flex justify-center">
              <img
                ref={avatarRef}
                src={profile.avatar}
                alt={profile.name}
                className="h-28 w-28 rounded-full object-cover border-4 border-current"
                loading="lazy"
              />
            </div>
          )}

          <h1 className="profile-text text-3xl font-bold mb-2 tracking-[0.2em] uppercase">
            {profile?.name || 'Your Name'}
          </h1>
          {profile?.bio && (
            <p className="profile-text text-base max-w-xs mx-auto opacity-75 leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div ref={linksRef} className="mt-10 space-y-4">
            {(links || []).map((link, index) => (
              <a
                key={index}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-3 w-full px-6 py-4 font-semibold transition-all duration-100"
                style={getButtonStyle()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(3px, -3px)';
                  e.currentTarget.style.boxShadow = `${3 * shadowIntensity / 100}px ${3 * shadowIntensity / 100}px 0 rgba(0,0,0,0.4)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = getButtonStyle().boxShadow as string;
                }}
              >
                <span>{link.title || 'Untitled Link'}</span>
                <ArrowUpRight className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          <div className="mt-12 pt-8">
            <p className="text-xs opacity-40 font-medium tracking-wide">
              ✨ Made with PageCraft
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RetroWaveEditor({
  data,
  updateField,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: EditorProps) {
  return (
    <div className="space-y-6 pb-20">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="text-xs gap-1">
            <User className="h-3 w-3" /> Bio
          </TabsTrigger>
          <TabsTrigger value="links" className="text-xs gap-1">
            <Sparkles className="h-3 w-3" /> Links
          </TabsTrigger>
          <TabsTrigger value="theme" className="text-xs gap-1">
            <Palette className="h-3 w-3" /> Style
          </TabsTrigger>
          <TabsTrigger value="brand" className="text-xs gap-1">
            <Settings2 className="h-3 w-3" /> Brand
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Avatar URL</Label>
                <Input
                  value={data.profile?.avatar || ''}
                  onChange={(e) => updateField('profile.avatar', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={data.profile?.name || ''}
                  onChange={(e) => updateField('profile.name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={data.profile?.bio || ''}
                  onChange={(e) => updateField('profile.bio', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data.links || []).map((link, index) => (
                <div key={index} className="flex items-start gap-2 rounded-lg border border-border p-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={link.title}
                      onChange={(e) => updateArrayItem('links', index, 'title', e.target.value)}
                      placeholder="Title"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateArrayItem('links', index, 'url', e.target.value)}
                      placeholder="URL"
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeArrayItem('links', index)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addArrayItem('links', { title: 'New Link', url: '' })} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-4 space-y-4">
          <ThemeControls theme={data.theme || {}} updateField={updateField} category="linktree" />
        </TabsContent>

        <TabsContent value="brand" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Brand Kit</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandKitControls brandKit={data.brandKit || {}} onChange={(brandKit) => updateField('brandKit', brandKit as any)} />
            </CardContent>
          </TabsContent>
        </TabsContent>
      </Tabs>
    </div>
  );
}
