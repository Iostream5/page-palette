import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { LinktreeData } from '@/types/builder';
import { ArrowUpRight } from 'lucide-react';

interface GlassmorphismProps {
  data: LinktreeData;
}

export default function Glassmorphism({ data }: GlassmorphismProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const { profile, links, theme } = data;
  const borderRadius = theme?.borderRadius ?? 24;
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
            x: -60,
            opacity: 0,
            scale: 0.9,
            rotateX: 45
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
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
    const bg = theme?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (bg.includes('gradient') || bg.includes('linear')) {
      return { background: bg };
    }
    return { backgroundColor: bg };
  }, [theme?.background]);

  const getButtonStyle = () => {
    return {
      backgroundColor: theme?.buttonColor || 'rgba(255,255,255,0.1)',
      color: theme?.buttonTextColor || '#ffffff',
      borderRadius: `${borderRadius}px`,
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.25)',
      boxShadow: `0 8px 32px rgba(0,0,0,${shadowIntensity / 400}), inset 0 1px 0 rgba(255,255,255,0.2)`,
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
        <div
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${theme?.buttonColor || '#667eea'} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${theme?.textColor || '#764ba2'} 0%, transparent 70%)` }}
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
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))',
                  borderRadius: '50%',
                }}
              >
                <img
                  ref={avatarRef}
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-28 w-28 rounded-full object-cover shadow-lg"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          <h1 className="profile-text text-3xl font-bold mb-2">
            {profile?.name || 'Your Name'}
          </h1>
          {profile?.bio && (
            <p className="profile-text text-base max-w-xs mx-auto opacity-90 leading-relaxed">
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
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.backgroundColor = getButtonStyle().backgroundColor as string;
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
