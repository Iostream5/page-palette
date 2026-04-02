import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { LinktreeData, BrandKit } from '@/types/builder';
import { ArrowUpRight, Settings2, Sparkles, User, Palette } from 'lucide-react';
import { EditorProps } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { ThemeControls } from '@/components/editor/ThemeControls';
import { AnimationSelector } from '@/components/editor/AnimationSelector';
import { BrandKitControls } from '@/components/editor/BrandKitControls';

interface NeonGlowProps {
  data: LinktreeData;
}

export default function NeonGlow({ data }: NeonGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const { profile, links, theme } = data;
  const borderRadius = theme?.borderRadius ?? 12;
  const shadowIntensity = theme?.shadowIntensity ?? 50;
  const animationSpeed = theme?.animationSpeed ?? 1;

  useEffect(() => {
    if (!containerRef.current) return;
    const speed = 1 / animationSpeed;

    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.fromTo('.neon-particle',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.4, duration: 1 * speed, stagger: 0.2, ease: 'back.out(2)' }
      );

      if (avatarRef.current) {
        gsap.fromTo(avatarRef.current,
          { scale: 0, rotate: -180 },
          { scale: 1, rotate: 0, duration: 0.8 * speed, ease: 'back.out(1.7)' }
        );

        // Continuous pulse for avatar
        gsap.to(avatarRef.current, {
          scale: 1.02,
          duration: 2 * speed,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1
        });
      }

      // Profile text with stagger
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

      // Links with cascading animation
      if (linksRef.current) {
        const linkElements = linksRef.current.children;
        gsap.fromTo(linkElements,
          {
            x: -60,
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
    const bg = theme?.background || '#0a0a0a';
    if (bg.includes('gradient') || bg.includes('linear')) {
      return { background: bg };
    }
    return { backgroundColor: bg };
  }, [theme?.background]);

  const getShadow = (intensity: number, color?: string) => {
    const base = intensity / 100;
    const glowColor = color || theme?.glowColor || theme?.buttonColor || '#00ff88';
    return `0 0 ${20 * base}px ${glowColor}, 0 0 ${40 * base}px ${glowColor}40, 0 0 ${60 * base}px ${glowColor}20`;
  };

  const getButtonStyle = () => {
    const glowColor = theme?.glowColor || theme?.buttonColor || '#00ff88';
    return {
      backgroundColor: theme?.buttonColor || '#1a1a1a',
      color: theme?.buttonTextColor || '#ffffff',
      borderRadius: `${borderRadius}px`,
      background: `linear-gradient(135deg, ${theme?.buttonColor || '#1a1a1a'} 0%, ${theme?.buttonColor || '#1a1a1a'}dd 100%)`,
      boxShadow: getShadow(shadowIntensity, glowColor),
      border: `1px solid ${glowColor}80`,
      backdropFilter: 'blur(4px)',
    };
  };

  return (
    <div
      ref={containerRef}
      className="min-h-full w-full relative overflow-hidden"
      style={{
        ...backgroundStyle,
        color: theme?.textColor || '#ffffff',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="neon-particle absolute w-2 h-2 rounded-full opacity-40"
            style={{
              background: theme?.glowColor || theme?.buttonColor || '#00ff88',
              left: `${15 + i * 15}%`,
              top: `${70 + Math.random() * 20}%`,
              filter: `blur(${2 + Math.random() * 2}px)`,
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${theme?.glowColor || '#00ff88'}15 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-md text-center">
          {/* Avatar */}
          {profile?.avatar && (
            <div className="mb-6 flex justify-center">
              <div
                className="relative"
                style={{
                  padding: '4px',
                  background: `linear-gradient(135deg, ${theme?.glowColor || '#00ff88'}, ${theme?.buttonColor || '#00ff88'})`,
                  borderRadius: '50%',
                  boxShadow: getShadow(shadowIntensity, theme?.glowColor || '#00ff88'),
                }}
              >
                <img
                  ref={avatarRef}
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-28 w-28 rounded-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Name & Bio */}
          <h1
            className="profile-text text-3xl font-bold mb-2"
            style={{
              textShadow: `0 0 20px ${theme?.textColor}80`,
            }}
          >
            {profile?.name || 'Your Name'}
          </h1>
          {profile?.bio && (
            <p
              className="profile-text text-base max-w-xs mx-auto opacity-75"
              style={{ lineHeight: 1.6 }}
            >
              {profile.bio}
            </p>
          )}

          {/* Links */}
          <div ref={linksRef} className="mt-10 space-y-4">
            {(links || []).map((link, index) => (
              <a
                key={index}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-3 w-full px-6 py-4 font-semibold transition-all duration-300"
                style={getButtonStyle()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  const glowColor = theme?.glowColor || theme?.buttonColor || '#00ff88';
                  e.currentTarget.style.boxShadow = getShadow(shadowIntensity * 1.5, glowColor);
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

          {/* Powered by badge */}
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

export function NeonGlowEditor({
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
            <User className="h-3 w-3" />
            Bio
          </TabsTrigger>
          <TabsTrigger value="links" className="text-xs gap-1">
            <Sparkles className="h-3 w-3" />
            Links
          </TabsTrigger>
          <TabsTrigger value="theme" className="text-xs gap-1">
            <Palette className="h-3 w-3" />
            Style
          </TabsTrigger>
          <TabsTrigger value="brand" className="text-xs gap-1">
            <Settings2 className="h-3 w-3" />
            Brand
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Avatar URL</Label>
                <Input
                  value={data.profile?.avatar || ''}
                  onChange={(e) => updateField('profile.avatar', e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={data.profile?.name || ''}
                  onChange={(e) => updateField('profile.name', e.target.value)}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={data.profile?.bio || ''}
                  onChange={(e) => updateField('profile.bio', e.target.value)}
                  placeholder="A short bio about yourself"
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
                      placeholder="Link Title"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateArrayItem('links', index, 'url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('links', index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('links', { title: 'New Link', url: '' })}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-4 space-y-4">
          <ThemeControls
            theme={data.theme || {}}
            updateField={updateField}
            category="linktree"
          />
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Animations</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimationSelector
                value={data.animations || []}
                onChange={(animations) => updateField('animations', animations as any)}
                maxSelections={3}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Brand Kit</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandKitControls
                brandKit={data.brandKit || {}}
                onChange={(brandKit) => updateField('brandKit', brandKit as any)}
              />
            </CardContent>
          </TabsContent>
        </TabsContent>
      </Tabs>
    </div>
  );
}
