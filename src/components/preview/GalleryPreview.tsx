 import { useEffect, useRef, useMemo } from 'react';
 import gsap from 'gsap';
 import { GalleryData } from '@/types/builder';
 import { Camera, Heart, Share2, ZoomIn } from 'lucide-react';
 
 interface GalleryPreviewProps {
   data: GalleryData;
   templateName: string;
 }
 
 export function GalleryPreview({ data, templateName }: GalleryPreviewProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const headerRef = useRef<HTMLDivElement>(null);
   const gridRef = useRef<HTMLDivElement>(null);
 
   const { header, photos, theme } = data;
   
   const borderRadius = theme?.borderRadius ?? 12;
   const shadowIntensity = theme?.shadowIntensity ?? 50;
   const animationSpeed = theme?.animationSpeed ?? 1;
   const accentColor = theme?.accentColor || '#3b82f6';
 
   const isMasonry = templateName === 'Masonry Dark';
   const isPolaroid = templateName === 'Polaroid Stack';
   const isFilm = templateName === 'Film Strip';
 
   useEffect(() => {
     if (!containerRef.current) return;
     const speed = 1 / animationSpeed;
 
     const ctx = gsap.context(() => {
       if (headerRef.current) {
         gsap.fromTo(headerRef.current,
           { y: -40, opacity: 0 },
           { y: 0, opacity: 1, duration: 0.8 * speed, ease: 'power3.out' }
         );
         
         gsap.fromTo('.header-accent',
           { scaleX: 0, transformOrigin: 'left center' },
           { scaleX: 1, duration: 0.6 * speed, delay: 0.4, ease: 'power2.out' }
         );
       }
 
       if (gridRef.current) {
         const items = gridRef.current.children;
         
         if (isPolaroid) {
           gsap.fromTo(items,
             { y: 100, rotation: (i) => [15, -10, 8, -15, 12][i % 5], opacity: 0 },
             { 
               y: 0, 
               rotation: (i) => [-3, 2, -1, 3, -2][i % 5], 
               opacity: 1, 
               duration: 0.8 * speed, 
               stagger: 0.15, 
               delay: 0.3,
               ease: 'power2.out' 
             }
           );
         } else if (isFilm) {
           gsap.fromTo(items,
             { x: 100, opacity: 0, scale: 0.9 },
             { x: 0, opacity: 1, scale: 1, duration: 0.5 * speed, stagger: 0.08, delay: 0.3, ease: 'power2.out' }
           );
         } else {
           gsap.fromTo(items,
             { scale: 0.7, opacity: 0, y: 40 },
             { scale: 1, opacity: 1, y: 0, duration: 0.6 * speed, stagger: 0.08, delay: 0.4, ease: 'back.out(1.2)' }
           );
         }
       }
     }, containerRef);
 
     return () => ctx.revert();
   }, [templateName, animationSpeed, isPolaroid, isFilm]);
 
   const getShadow = useMemo(() => {
     const base = shadowIntensity / 100;
     return `0 ${8 * base}px ${32 * base}px rgba(0,0,0,${0.12 * base}), 0 ${4 * base}px ${12 * base}px rgba(0,0,0,${0.08 * base})`;
   }, [shadowIntensity]);
 
   const getPhotoStyle = (index: number): React.CSSProperties => {
     if (isPolaroid) {
       const rotations = [-3, 2.5, -1.5, 3.5, -2, 1.5];
       return {
         transform: `rotate(${rotations[index % rotations.length]}deg)`,
         background: '#ffffff',
         padding: '12px 12px 48px',
         boxShadow: `0 ${10 * shadowIntensity / 100}px ${40 * shadowIntensity / 100}px rgba(0,0,0,${0.2 * shadowIntensity / 100})`,
         borderRadius: '4px',
       };
     }
     return {
       borderRadius: `${borderRadius}px`,
       boxShadow: getShadow,
     };
   };
 
   const gridClass = isFilm
     ? 'flex gap-6 overflow-x-auto pb-6 px-4 scrollbar-hide'
     : isPolaroid
     ? 'grid grid-cols-2 gap-10 p-6 max-w-xl mx-auto'
     : 'grid grid-cols-2 md:grid-cols-3 gap-4';
 
   return (
     <div
       ref={containerRef}
       className="min-h-full w-full relative"
       style={{
         backgroundColor: theme?.background || '#f8f9fa',
         color: theme?.textColor || '#1a1a1a',
       }}
     >
       {isMasonry && (
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div 
             className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
             style={{ background: accentColor }}
           />
           <div 
             className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
             style={{ background: accentColor }}
           />
         </div>
       )}
 
       {isFilm && (
         <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/20 to-transparent" />
           <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent" />
         </div>
       )}
 
       <div className="relative z-10 px-6 py-12">
         <div ref={headerRef} className="mb-10 text-center">
           <div className="inline-flex items-center gap-2 mb-4">
             <Camera className="w-5 h-5 opacity-50" />
             <span className="text-xs font-medium uppercase tracking-[0.2em] opacity-50">Gallery</span>
           </div>
           <h1 
             className={`text-4xl font-bold mb-3 ${isMasonry ? 'tracking-tight' : ''}`}
             style={{ 
               background: isMasonry ? `linear-gradient(135deg, ${theme?.textColor || '#1a1a1a'}, ${accentColor})` : undefined,
               WebkitBackgroundClip: isMasonry ? 'text' : undefined,
               WebkitTextFillColor: isMasonry ? 'transparent' : undefined,
             }}
           >
             {header?.title || 'My Gallery'}
           </h1>
           {header?.description && (
             <p className="text-base opacity-60 max-w-md mx-auto leading-relaxed">
               {header.description}
             </p>
           )}
           <div 
             className="header-accent h-1 w-16 mx-auto mt-6 rounded-full"
             style={{ background: accentColor }}
           />
         </div>
 
         <div ref={gridRef} className={gridClass}>
           {(photos || []).map((photo, index) => (
             <div
               key={index}
               className={`relative group ${isFilm ? 'flex-shrink-0 w-72' : ''}`}
               style={getPhotoStyle(index)}
             >
               <div 
                 className={`overflow-hidden ${isFilm ? 'aspect-[3/4]' : 'aspect-square'}`}
                 style={{ borderRadius: isPolaroid ? '2px' : `${borderRadius}px` }}
               >
                 <img
                   src={photo.url}
                   alt={photo.caption}
                   className={`h-full w-full object-cover transition-all duration-500 ${
                     !isPolaroid ? 'group-hover:scale-110' : ''
                   }`}
                   loading="lazy"
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = '/placeholder.svg';
                   }}
                 />
                 
                 {!isPolaroid && (
                   <div 
                     className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                     style={{ 
                       background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)`,
                       borderRadius: `${borderRadius}px`,
                     }}
                   >
                     <div className="flex items-center gap-4 text-white">
                       <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                         <Heart className="w-5 h-5" />
                       </button>
                       <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                         <ZoomIn className="w-5 h-5" />
                       </button>
                       <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                         <Share2 className="w-5 h-5" />
                       </button>
                     </div>
                   </div>
                 )}
               </div>
               
               {photo.caption && (
                 <p className={`mt-3 text-center ${
                   isPolaroid ? 'font-handwriting text-xl text-gray-700 absolute bottom-3 left-0 right-0' : 'text-sm opacity-70'
                 }`}>
                   {photo.caption}
                 </p>
               )}
               
               {isMasonry && photo.caption && (
                 <div 
                   className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{ borderRadius: `0 0 ${borderRadius}px ${borderRadius}px` }}
                 >
                   <p className="text-white text-sm font-medium drop-shadow-lg">{photo.caption}</p>
                 </div>
               )}
             </div>
           ))}
         </div>
 
         <div className="mt-12 text-center">
           <p className="text-xs opacity-30 font-medium tracking-wide">
             📸 Captured with PageCraft
           </p>
         </div>
       </div>
     </div>
   );
 }