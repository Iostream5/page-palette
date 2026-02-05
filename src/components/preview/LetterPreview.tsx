 import { useEffect, useRef } from 'react';
 import gsap from 'gsap';
 import { LetterData } from '@/types/builder';
 
 interface LetterPreviewProps {
   data: LetterData;
   templateName: string;
 }
 
 export function LetterPreview({ data, templateName }: LetterPreviewProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const contentRef = useRef<HTMLDivElement>(null);
 
   const { letter, document: doc, theme } = data;
 
   useEffect(() => {
     if (!containerRef.current) return;
 
     const ctx = gsap.context(() => {
       const isTypewriter = templateName === 'Typewriter';
       const isLoveLetter = templateName === 'Love Letter';
 
       if (isTypewriter && contentRef.current) {
         // Typewriter effect - letters appear sequentially
         gsap.fromTo(contentRef.current,
           { opacity: 0, y: 20 },
           { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
         );
         
         gsap.fromTo('.typewriter-line',
           { opacity: 0, x: -10 },
           { opacity: 1, x: 0, duration: 0.3, stagger: 0.15, delay: 0.3 }
         );
       } else if (isLoveLetter && contentRef.current) {
         // Romantic fade in with scale
         gsap.fromTo(contentRef.current,
           { scale: 0.9, opacity: 0, rotation: -2 },
           { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'power3.out' }
         );
 
         gsap.fromTo('.love-heart',
           { scale: 0 },
           { scale: 1, duration: 0.5, delay: 0.8, ease: 'back.out(2)' }
         );
       } else {
         // Default fade in
         gsap.fromTo(contentRef.current,
           { y: 30, opacity: 0 },
           { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
         );
       }
     }, containerRef);
 
     return () => ctx.revert();
   }, [templateName]);
 
   const isTypewriter = templateName === 'Typewriter';
   const isLoveLetter = templateName === 'Love Letter';
   const isOfficial = templateName === 'Official Document';
 
   const getFontFamily = () => {
     const font = theme?.fontFamily;
     if (font === 'typewriter') return '"Courier New", Courier, monospace';
     if (font === 'cursive') return '"Brush Script MT", "Segoe Script", cursive';
     if (font === 'serif') return 'Georgia, "Times New Roman", serif';
     if (font === 'sans') return 'system-ui, -apple-system, sans-serif';
     return 'inherit';
   };
 
   if (letter) {
     return (
       <div
         ref={containerRef}
         className={`min-h-full w-full px-4 py-12 ${isLoveLetter ? 'overflow-hidden' : ''}`}
         style={{
           backgroundColor: theme?.background || '#faf7f2',
           color: theme?.textColor || '#2d2d2d',
           fontFamily: getFontFamily(),
         }}
       >
         {/* Decorative elements for love letter */}
         {isLoveLetter && (
           <>
             <div className="absolute top-4 right-4 love-heart text-4xl">💕</div>
             <div className="absolute bottom-4 left-4 love-heart text-3xl">🌹</div>
           </>
         )}
 
         <div 
           ref={contentRef}
           className={`mx-auto max-w-2xl ${
             isTypewriter ? 'bg-white/50 p-8 shadow-lg' : 
             isLoveLetter ? 'relative p-8' : 
             'p-4'
           }`}
           style={isTypewriter ? { 
             backgroundImage: 'repeating-linear-gradient(transparent, transparent 28px, #e0e0e0 28px, #e0e0e0 29px)'
           } : {}}
         >
           {/* Title */}
           <h1 className={`mb-2 text-center ${
             isLoveLetter ? 'text-4xl font-light italic' : 
             isTypewriter ? 'typewriter-line text-2xl uppercase tracking-widest' : 
             'text-3xl font-semibold'
           }`}>
             {letter.title || 'A Letter'}
           </h1>
           {letter.date && (
             <p className={`mb-8 text-center text-sm ${isTypewriter ? 'typewriter-line' : ''} opacity-60`}>
               {letter.date}
             </p>
           )}
 
           {/* Letter Body */}
           <div className="space-y-6">
             <p className={`${isLoveLetter ? 'text-xl italic' : isTypewriter ? 'typewriter-line' : 'text-lg'}`}>
               {letter.greeting || 'Dear Reader,'}
             </p>
             <div className={`whitespace-pre-wrap leading-relaxed ${
               isTypewriter ? 'typewriter-line tracking-wide' : 
               isLoveLetter ? 'text-lg leading-loose' : ''
             }`}>
               {letter.body || 'Your letter content goes here...'}
             </div>
             <div className={`pt-4 ${isTypewriter ? 'typewriter-line' : ''}`}>
               <p className={isLoveLetter ? 'italic' : ''}>{letter.closing || 'Sincerely,'}</p>
               <p className={`mt-2 ${
                 isLoveLetter ? 'text-2xl' : 
                 isTypewriter ? 'uppercase tracking-widest' : 
                 'font-medium'
               }`}>
                 {letter.signature || 'Your Name'}
               </p>
             </div>
           </div>
         </div>
       </div>
     );
   }
 
   if (doc) {
     return (
       <div
         ref={containerRef}
         className="min-h-full w-full px-4 py-12"
         style={{
           backgroundColor: theme?.background || '#ffffff',
           color: theme?.textColor || '#1a1a1a',
           fontFamily: getFontFamily(),
         }}
       >
         <div 
           ref={contentRef}
           className={`mx-auto max-w-2xl ${isOfficial ? 'border-t-4 pt-8' : ''}`}
           style={isOfficial ? { borderColor: theme?.accentColor } : {}}
         >
           {/* Header */}
           <h1 className={`mb-2 ${isOfficial ? 'text-3xl font-bold uppercase tracking-wide' : 'text-4xl font-bold'}`}>
             {doc.title || 'Document Title'}
           </h1>
           {doc.subtitle && (
             <p className={`mb-2 ${isOfficial ? 'text-sm uppercase tracking-widest' : 'text-lg'} opacity-70`}>
               {doc.subtitle}
             </p>
           )}
           {doc.author && (
             <p className="mb-8 text-sm opacity-50">By {doc.author}</p>
           )}
 
           {isOfficial && <hr className="mb-8 border-gray-300" />}
 
           {/* Content */}
           <div className={`whitespace-pre-wrap leading-relaxed ${isOfficial ? 'text-justify' : ''}`}>
             {doc.content || 'Your document content goes here...'}
           </div>
 
           {isOfficial && (
             <div className="mt-12 border-t pt-4 text-xs text-gray-500">
               This is an official document
             </div>
           )}
         </div>
       </div>
     );
   }
 
   return null;
 }