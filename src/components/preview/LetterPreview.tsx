 import { useEffect, useRef, useMemo } from 'react';
 import gsap from 'gsap';
 import { LetterData } from '@/types/builder';
 import { Feather, FileText, Heart, Calendar, User } from 'lucide-react';
 
 interface LetterPreviewProps {
   data: LetterData;
   templateName: string;
 }
 
 export function LetterPreview({ data, templateName }: LetterPreviewProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const contentRef = useRef<HTMLDivElement>(null);
 
   const { letter, document: doc, theme } = data;
   
   const borderRadius = theme?.borderRadius ?? 12;
   const shadowIntensity = theme?.shadowIntensity ?? 50;
   const animationSpeed = theme?.animationSpeed ?? 1;
   const accentColor = theme?.accentColor || '#c084fc';
 
   const isTypewriter = templateName === 'Typewriter';
   const isLoveLetter = templateName === 'Love Letter';
   const isOfficial = templateName === 'Official Document';
 
   useEffect(() => {
     if (!containerRef.current) return;
     const speed = 1 / animationSpeed;
 
     const ctx = gsap.context(() => {
       if (contentRef.current) {
         gsap.fromTo(contentRef.current,
           { y: 60, opacity: 0, scale: 0.95, rotateX: 10 },
           { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.8 * speed, ease: 'power3.out' }
         );
       }
 
       if (isTypewriter) {
         const lines = containerRef.current?.querySelectorAll('.animate-line');
         gsap.fromTo(lines,
           { opacity: 0, x: -10 },
           { opacity: 1, x: 0, duration: 0.3 * speed, stagger: 0.08, delay: 0.5, ease: 'steps(1)' }
         );
       } else if (isLoveLetter) {
         const lines = containerRef.current?.querySelectorAll('.animate-line');
         gsap.fromTo(lines,
           { y: 30, opacity: 0, filter: 'blur(8px)' },
           { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7 * speed, stagger: 0.12, delay: 0.4, ease: 'power2.out' }
         );
         
         gsap.to('.floating-heart', {
           y: -15,
           rotation: 10,
           duration: 2 * speed,
           repeat: -1,
           yoyo: true,
           ease: 'sine.inOut',
           stagger: 0.3
         });
       } else {
         const lines = containerRef.current?.querySelectorAll('.animate-line');
         gsap.fromTo(lines,
           { y: 25, opacity: 0 },
           { y: 0, opacity: 1, duration: 0.5 * speed, stagger: 0.1, delay: 0.4, ease: 'power2.out' }
         );
       }
     }, containerRef);
 
     return () => ctx.revert();
   }, [templateName, animationSpeed, isTypewriter, isLoveLetter]);
 
   const getShadow = useMemo(() => {
     const base = shadowIntensity / 100;
     if (isLoveLetter) {
       return `0 ${20 * base}px ${60 * base}px rgba(192, 132, 252, ${0.15 * base}), 0 ${8 * base}px ${24 * base}px rgba(0,0,0,${0.08 * base})`;
     }
     return `0 ${10 * base}px ${40 * base}px rgba(0,0,0,${0.12 * base}), 0 ${4 * base}px ${16 * base}px rgba(0,0,0,${0.08 * base})`;
   }, [shadowIntensity, isLoveLetter]);
 
   const fontFamily = isTypewriter
     ? "'Courier New', 'Monaco', monospace"
     : isLoveLetter
     ? theme?.fontFamily || "'Caveat', cursive"
     : "'Inter', system-ui, sans-serif";
 
   const containerStyle: React.CSSProperties = {
     backgroundColor: theme?.background || '#faf7f2',
     color: theme?.textColor || '#2d2d2d',
     fontFamily,
   };
 
   if (letter) {
     return (
       <div
         ref={containerRef}
         className="min-h-full w-full px-6 py-16 relative overflow-hidden"
         style={containerStyle}
       >
         {isLoveLetter && (
           <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {[...Array(5)].map((_, i) => (
               <Heart
                 key={i}
                 className="floating-heart absolute text-pink-300/30"
                 style={{
                   left: `${10 + i * 20}%`,
                   top: `${15 + (i % 3) * 25}%`,
                   width: `${20 + i * 5}px`,
                   height: `${20 + i * 5}px`,
                 }}
                 fill="currentColor"
               />
             ))}
             <div 
               className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
               style={{ background: `linear-gradient(135deg, ${accentColor}, #f472b6)` }}
             />
           </div>
         )}
 
         {isTypewriter && (
           <div className="absolute top-4 right-4 opacity-20">
             <Feather className="w-12 h-12" style={{ color: theme?.textColor }} />
           </div>
         )}
 
         <div
           ref={contentRef}
           className="mx-auto max-w-xl relative"
           style={{
             background: isTypewriter ? '#fffef5' : isLoveLetter ? 'linear-gradient(180deg, #fff 0%, #fef7f7 100%)' : '#ffffff',
             padding: isTypewriter ? '48px 56px' : isLoveLetter ? '56px 48px' : '40px',
             borderRadius: `${borderRadius}px`,
             boxShadow: getShadow,
             ...(isTypewriter && {
               backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e8e8e8 32px)',
               backgroundPosition: '0 16px',
             }),
           }}
         >
           {isLoveLetter && (
             <div className="absolute -top-6 left-1/2 -translate-x-1/2">
               <div 
                 className="w-12 h-12 rounded-full flex items-center justify-center"
                 style={{ 
                   background: `linear-gradient(135deg, ${accentColor}, #f472b6)`,
                   boxShadow: `0 4px 20px ${accentColor}40`
                 }}
               >
                 <Heart className="w-6 h-6 text-white" fill="white" />
               </div>
             </div>
           )}
 
           <div className="animate-line flex items-center justify-end gap-2 text-sm opacity-50 mb-10">
             <Calendar className="w-3.5 h-3.5" />
             {letter.date || 'Date'}
           </div>
 
           {letter.title && (
             <h1 
               className={`animate-line text-center mb-10 ${
                 isLoveLetter ? 'text-5xl' : isTypewriter ? 'text-xl uppercase tracking-[0.3em]' : 'text-3xl font-semibold'
               }`}
               style={{ color: isLoveLetter ? accentColor : undefined }}
             >
               {letter.title}
             </h1>
           )}
 
           <p className={`animate-line mb-8 ${isLoveLetter ? 'text-3xl' : isTypewriter ? 'text-base' : 'text-xl'}`}>
             {letter.greeting || 'Dear Reader,'}
           </p>
 
           <div className={`animate-line whitespace-pre-wrap ${
             isLoveLetter ? 'text-2xl leading-[2]' : isTypewriter ? 'text-sm leading-8' : 'text-base leading-8'
           }`}>
             {letter.body || 'Your letter content goes here...'}
           </div>
 
           <p className={`animate-line mt-10 ${isLoveLetter ? 'text-2xl' : ''}`}>
             {letter.closing || 'Sincerely,'}
           </p>
 
           <p 
             className={`animate-line mt-4 ${isLoveLetter ? 'text-4xl' : isTypewriter ? 'uppercase tracking-wider' : 'text-xl font-semibold'}`}
             style={{ color: isLoveLetter ? accentColor : undefined }}
           >
             {letter.signature || 'Your Name'}
           </p>
 
           {!isTypewriter && (
             <div className="animate-line mt-8 h-0.5 w-16" style={{ background: accentColor, opacity: 0.5 }} />
           )}
         </div>
 
         <div className="mt-10 text-center">
           <p className="text-xs opacity-30 font-medium tracking-wide">✉️ Written with PageCraft</p>
         </div>
       </div>
     );
   }
 
   if (doc) {
     return (
       <div
         ref={containerRef}
         className="min-h-full w-full px-6 py-16 relative"
         style={containerStyle}
       >
         {isOfficial && (
           <div className="absolute inset-0 pointer-events-none">
             <div 
               className="absolute top-0 left-0 w-2 h-full"
               style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }}
             />
           </div>
         )}
 
         <div
           ref={contentRef}
           className="mx-auto max-w-2xl relative"
           style={{
             background: '#ffffff',
             padding: isOfficial ? '64px 56px' : '48px',
             borderRadius: `${borderRadius}px`,
             boxShadow: getShadow,
             borderTop: isOfficial ? `5px solid ${accentColor}` : undefined,
           }}
         >
           <div className="animate-line flex justify-center mb-8">
             <div 
               className="w-14 h-14 rounded-xl flex items-center justify-center"
               style={{ background: `${accentColor}15` }}
             >
               <FileText className="w-7 h-7" style={{ color: accentColor }} />
             </div>
           </div>
 
           <h1 className={`animate-line text-center mb-4 ${
             isOfficial ? 'text-3xl font-bold uppercase tracking-[0.15em]' : 'text-4xl font-bold'
           }`}>
             {doc.title || 'Document Title'}
           </h1>
 
           {doc.subtitle && (
             <p className="animate-line text-center text-lg opacity-60 mb-8 max-w-md mx-auto">
               {doc.subtitle}
             </p>
           )}
 
           <div className="animate-line w-20 h-1 mx-auto mb-10 rounded-full" style={{ background: accentColor }} />
 
           <div className="animate-line whitespace-pre-wrap leading-8 text-justify">
             {doc.content || 'Your document content goes here...'}
           </div>
 
           <div 
             className="animate-line mt-14 pt-8 flex items-center justify-end gap-3"
             style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
           >
             <User className="w-4 h-4 opacity-50" />
             <p className="font-semibold">{doc.author || 'Author Name'}</p>
           </div>
         </div>
 
         <div className="mt-10 text-center">
           <p className="text-xs opacity-30 font-medium tracking-wide">📄 Created with PageCraft</p>
         </div>
       </div>
     );
   }
 
   return null;
 }