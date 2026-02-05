 import { useEffect, useRef, useMemo } from 'react';
 import gsap from 'gsap';
 import { LinktreeData } from '@/types/builder';
 import { ExternalLink, ArrowUpRight } from 'lucide-react';
 
 interface LinktreePreviewProps {
   data: LinktreeData;
   templateName: string;
 }
 
 export function LinktreePreview({ data, templateName }: LinktreePreviewProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const avatarRef = useRef<HTMLImageElement>(null);
   const linksRef = useRef<HTMLDivElement>(null);
 
   const { profile, links, theme } = data;
   
   const borderRadius = theme?.borderRadius ?? 12;
   const shadowIntensity = theme?.shadowIntensity ?? 50;
   const animationSpeed = theme?.animationSpeed ?? 1;
 
   // Template variants
   const isNeon = templateName === 'Neon Glow';
   const isGlass = templateName === 'Glassmorphism';
   const isRetro = templateName === 'Retro Wave';
 
   useEffect(() => {
     if (!containerRef.current) return;
     const speed = 1 / animationSpeed;
 
     const ctx = gsap.context(() => {
       // Floating particles effect for neon
       if (isNeon) {
         gsap.to('.neon-particle', {
           y: -20,
           opacity: 0.8,
           duration: 2 * speed,
           stagger: 0.3,
           repeat: -1,
           yoyo: true,
           ease: 'sine.inOut'
         });
       }
 
       // Avatar entrance
       if (avatarRef.current) {
         gsap.fromTo(avatarRef.current, 
           { scale: 0, rotation: isNeon ? 0 : -180, opacity: 0 },
           { 
             scale: 1, 
             rotation: 0, 
             opacity: 1,
             duration: 0.8 * speed, 
             ease: 'back.out(1.7)',
             delay: 0.2
           }
         );
         
         // Continuous subtle pulse for avatar
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
             x: isRetro ? 100 : -60, 
             opacity: 0,
             scale: 0.9,
             rotateX: isGlass ? 45 : 0
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
   }, [templateName, animationSpeed, isNeon, isGlass, isRetro]);
 
   const backgroundStyle = useMemo(() => {
     const bg = theme?.background || '#ffffff';
     if (bg.includes('gradient') || bg.includes('linear')) {
       return { background: bg };
     }
     return { backgroundColor: bg };
   }, [theme?.background]);
 
   const getShadow = (intensity: number, color?: string) => {
     const base = intensity / 100;
     if (isNeon && color) {
       return `0 0 ${20 * base}px ${color}, 0 0 ${40 * base}px ${color}40, 0 0 ${60 * base}px ${color}20`;
     }
     return `0 ${4 * base}px ${20 * base}px rgba(0,0,0,${0.15 * base}), 0 ${8 * base}px ${32 * base}px rgba(0,0,0,${0.1 * base})`;
   };
 
   const getButtonStyle = () => {
     const btnRadius = isRetro ? 0 : borderRadius;
     const base: React.CSSProperties = {
       backgroundColor: theme?.buttonColor || '#1a1a1a',
       color: theme?.buttonTextColor || '#ffffff',
       borderRadius: `${btnRadius}px`,
       boxShadow: getShadow(shadowIntensity),
     };
 
     if (isNeon) {
       const glowColor = theme?.glowColor || theme?.buttonColor || '#00ff88';
       return {
         ...base,
         background: `linear-gradient(135deg, ${theme?.buttonColor || '#1a1a1a'} 0%, ${theme?.buttonColor || '#1a1a1a'}dd 100%)`,
         boxShadow: getShadow(shadowIntensity, glowColor),
         border: `1px solid ${glowColor}80`,
         backdropFilter: 'blur(4px)',
       };
     }
 
     if (isGlass) {
       return {
         ...base,
         background: `${theme?.buttonColor || 'rgba(255,255,255,0.1)'}`,
         backdropFilter: 'blur(12px)',
         border: '1px solid rgba(255,255,255,0.25)',
         boxShadow: `0 8px 32px rgba(0,0,0,${shadowIntensity / 400}), inset 0 1px 0 rgba(255,255,255,0.2)`,
       };
     }
 
     if (isRetro) {
       return {
         ...base,
         boxShadow: `${6 * shadowIntensity / 100}px ${6 * shadowIntensity / 100}px 0 rgba(0,0,0,0.4)`,
         border: '3px solid currentColor',
         textTransform: 'uppercase' as const,
         letterSpacing: '0.1em',
         fontWeight: 700,
       };
     }
 
     return base;
   };
 
   return (
     <div
       ref={containerRef}
       className="min-h-full w-full relative overflow-hidden"
       style={{
         ...backgroundStyle,
         color: theme?.textColor || '#1a1a1a',
       }}
     >
       {/* Decorative elements */}
       {isNeon && (
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
       )}
 
       {isGlass && (
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
       )}
 
       {isRetro && (
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
       )}
 
       <div className="relative z-10 px-6 py-16">
         <div className="mx-auto max-w-md text-center">
           {/* Avatar */}
           {profile?.avatar && (
             <div className="mb-6 flex justify-center">
               <div 
                 className="relative"
                 style={{
                   padding: '4px',
                   background: isNeon 
                     ? `linear-gradient(135deg, ${theme?.glowColor || '#00ff88'}, ${theme?.buttonColor || '#00ff88'})`
                     : isGlass 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))'
                     : undefined,
                   borderRadius: '50%',
                   boxShadow: isNeon ? getShadow(shadowIntensity, theme?.glowColor || '#00ff88') : undefined,
                 }}
               >
                 <img
                   ref={avatarRef}
                   src={profile.avatar}
                   alt={profile.name}
                   className="h-28 w-28 rounded-full object-cover"
                   style={{
                     boxShadow: !isNeon ? getShadow(shadowIntensity) : undefined,
                   }}
                   loading="lazy"
                   onError={(e) => {
                     (e.target as HTMLImageElement).style.display = 'none';
                   }}
                 />
               </div>
             </div>
           )}
 
           {/* Name & Bio */}
           <h1 
             className={`profile-text text-3xl font-bold mb-2 ${isRetro ? 'tracking-[0.2em] uppercase' : ''}`}
             style={{
               textShadow: isNeon ? `0 0 20px ${theme?.textColor}80` : undefined,
             }}
           >
             {profile?.name || 'Your Name'}
           </h1>
           {profile?.bio && (
             <p 
               className={`profile-text text-base max-w-xs mx-auto ${isGlass ? 'opacity-90' : 'opacity-75'}`}
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
                 className={`group relative flex items-center justify-center gap-3 w-full px-6 py-4 font-semibold transition-all ${
                   isRetro ? 'duration-100' : 'duration-300'
                 }`}
                 style={getButtonStyle()}
                 onMouseEnter={(e) => {
                   if (isRetro) {
                     e.currentTarget.style.transform = 'translate(3px, -3px)';
                     e.currentTarget.style.boxShadow = `${3 * shadowIntensity / 100}px ${3 * shadowIntensity / 100}px 0 rgba(0,0,0,0.4)`;
                   } else if (isNeon) {
                     e.currentTarget.style.transform = 'scale(1.02)';
                     e.currentTarget.style.boxShadow = getShadow(shadowIntensity * 1.5, theme?.glowColor || '#00ff88');
                   } else {
                     e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                   }
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