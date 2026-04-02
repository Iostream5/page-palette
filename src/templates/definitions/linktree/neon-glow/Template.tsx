import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { LinktreeData } from '@/types/builder';
import { ArrowUpRight } from 'lucide-react';

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
      gsap.fromTo('.neon-particle',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.4, duration: 1 * speed, stagger: 0.2, ease: 'back.out(2)' }
      );

      if (avatarRef.current) {
        gsap.fromTo(avatarRef.current,
          { scale: 0, rotate: -180 },
          { scale: 1, rotate: 0, duration: 0.8 * speed, ease: 'back.out(1.7)' }
        );

        gsap.to(avatarRef.current, {
          scale: 1.02,
          duration: 2 * speed,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1
        });
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

          <div className="mt-12 pt-8">
            <p className="text-xs opacity-40 font-medium tracking-wide">
              âœ¨ Made with PageCraft
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
