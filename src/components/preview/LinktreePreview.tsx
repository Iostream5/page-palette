 import { useEffect, useRef } from 'react';
 import gsap from 'gsap';
 import { LinktreeData } from '@/types/builder';
 
 interface LinktreePreviewProps {
   data: LinktreeData;
   templateName: string;
 }
 
 export function LinktreePreview({ data, templateName }: LinktreePreviewProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const avatarRef = useRef<HTMLImageElement>(null);
   const linksRef = useRef<HTMLDivElement>(null);
 
   const { profile, links, theme } = data;
 
   useEffect(() => {
     if (!containerRef.current) return;
 
     const ctx = gsap.context(() => {
       // Animate avatar
       if (avatarRef.current) {
         gsap.fromTo(avatarRef.current, 
           { scale: 0, rotation: -180 },
           { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
         );
       }
 
       // Animate name and bio
       gsap.fromTo('.profile-text',
         { y: 30, opacity: 0 },
         { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.3 }
       );
 
       // Animate links
       if (linksRef.current) {
         gsap.fromTo(linksRef.current.children,
           { x: -50, opacity: 0 },
           { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.5, ease: 'power2.out' }
         );
       }
     }, containerRef);
 
     return () => ctx.revert();
   }, [templateName]);
 
   const backgroundStyle = theme?.background?.includes('gradient') || theme?.background?.includes('linear')
     ? { background: theme.background }
     : { backgroundColor: theme?.background || '#ffffff' };
 
   // Template-specific styles
   const isNeon = templateName === 'Neon Glow';
   const isGlass = templateName === 'Glassmorphism';
   const isRetro = templateName === 'Retro Wave';
 
   const getButtonStyle = () => {
     const base = {
       backgroundColor: theme?.buttonColor || '#1a1a1a',
       color: theme?.buttonTextColor || '#ffffff',
     };
 
     if (isNeon) {
       return {
         ...base,
         boxShadow: `0 0 20px ${(theme as any)?.glowColor || '#00ff88'}, 0 0 40px ${(theme as any)?.glowColor || '#00ff88'}40`,
         border: `1px solid ${(theme as any)?.glowColor || '#00ff88'}`,
       };
     }
 
     if (isGlass) {
       return {
         ...base,
         backdropFilter: 'blur(10px)',
         border: '1px solid rgba(255,255,255,0.2)',
       };
     }
 
     if (isRetro) {
       return {
         ...base,
         boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
         border: '2px solid currentColor',
       };
     }
 
     return base;
   };
 
   return (
     <div
       ref={containerRef}
       className="min-h-full w-full px-4 py-12"
       style={{
         ...backgroundStyle,
         color: theme?.textColor || '#1a1a1a',
       }}
     >
       <div className="mx-auto max-w-md text-center">
         {/* Avatar */}
         {profile?.avatar && (
           <div className="mb-4 flex justify-center">
             <img
               ref={avatarRef}
               src={profile.avatar}
               alt={profile.name}
               className={`h-24 w-24 rounded-full object-cover ${
                 isNeon ? 'ring-2' : 'ring-4'
               } ring-white/20`}
               style={isNeon ? { boxShadow: `0 0 30px ${(theme as any)?.glowColor || '#00ff88'}` } : {}}
               loading="lazy"
               onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none';
               }}
             />
           </div>
         )}
 
         {/* Name & Bio */}
         <h1 className={`profile-text text-2xl font-bold ${isRetro ? 'tracking-wider' : ''}`}>
           {profile?.name || 'Your Name'}
         </h1>
         {profile?.bio && (
           <p className={`profile-text mt-2 text-sm ${isGlass ? 'opacity-90' : 'opacity-80'}`}>
             {profile.bio}
           </p>
         )}
 
         {/* Links */}
         <div ref={linksRef} className="mt-8 space-y-3">
           {(links || []).map((link, index) => (
             <a
               key={index}
               href={link.url || '#'}
               target="_blank"
               rel="noopener noreferrer"
               className={`block w-full px-4 py-3 text-center font-medium transition-all duration-300 ${
                 isGlass ? 'rounded-2xl hover:bg-white/25' : 
                 isNeon ? 'rounded-lg hover:scale-105' : 
                 isRetro ? 'rounded-none hover:translate-x-1 hover:-translate-y-1' :
                 'rounded-lg hover:scale-[1.02]'
               }`}
               style={getButtonStyle()}
             >
               {link.title || 'Untitled Link'}
             </a>
           ))}
         </div>
       </div>
     </div>
   );
 }