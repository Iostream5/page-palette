 import { useEffect, useRef } from 'react';
 import gsap from 'gsap';
 import { GalleryData } from '@/types/builder';
 
 interface GalleryPreviewProps {
   data: GalleryData;
   templateName: string;
 }
 
 export function GalleryPreview({ data, templateName }: GalleryPreviewProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const headerRef = useRef<HTMLDivElement>(null);
   const gridRef = useRef<HTMLDivElement>(null);
 
   const { header, photos, theme } = data;
 
   useEffect(() => {
     if (!containerRef.current) return;
 
     const ctx = gsap.context(() => {
       // Animate header
       if (headerRef.current) {
         gsap.fromTo(headerRef.current,
           { y: -30, opacity: 0 },
           { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
         );
       }
 
       // Animate photos based on template
       if (gridRef.current) {
         const items = gridRef.current.children;
         
         if (templateName === 'Polaroid Stack') {
           gsap.fromTo(items,
             { scale: 0, rotation: () => gsap.utils.random(-20, 20) },
             { 
               scale: 1, 
               rotation: () => gsap.utils.random(-8, 8), 
               duration: 0.6, 
               stagger: 0.15, 
               delay: 0.3,
               ease: 'back.out(1.4)' 
             }
           );
         } else if (templateName === 'Film Strip') {
           gsap.fromTo(items,
             { x: 100, opacity: 0 },
             { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
           );
         } else {
           gsap.fromTo(items,
             { y: 40, opacity: 0 },
             { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.3, ease: 'power2.out' }
           );
         }
       }
     }, containerRef);
 
     return () => ctx.revert();
   }, [templateName]);
 
   const isMasonryDark = templateName === 'Masonry Dark';
   const isPolaroid = templateName === 'Polaroid Stack';
   const isFilmStrip = templateName === 'Film Strip';
 
   const renderPolaroidGallery = () => (
     <div ref={gridRef} className="flex flex-wrap justify-center gap-6 p-4">
       {(photos || []).map((photo, index) => (
         <div
           key={index}
           className="bg-white p-3 pb-12 shadow-xl"
           style={{ 
             transform: `rotate(${(index % 2 === 0 ? -1 : 1) * (3 + index)}deg)`,
             boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
           }}
         >
           {photo.url ? (
             <img
               src={photo.url}
               alt={photo.caption}
               className="h-40 w-40 object-cover"
               loading="lazy"
             />
           ) : (
             <div className="flex h-40 w-40 items-center justify-center bg-gray-100 text-sm text-gray-400">
               No image
             </div>
           )}
           <p className="mt-3 text-center font-handwriting text-sm text-gray-700">
             {photo.caption}
           </p>
         </div>
       ))}
     </div>
   );
 
   const renderFilmStrip = () => (
     <div className="relative overflow-hidden py-8">
       <div className="absolute inset-y-0 left-0 w-8 bg-black z-10" style={{ 
         backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 15px, #333 15px, #333 20px)'
       }} />
       <div className="absolute inset-y-0 right-0 w-8 bg-black z-10" style={{ 
         backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 15px, #333 15px, #333 20px)'
       }} />
       <div ref={gridRef} className="flex gap-4 overflow-x-auto px-12 pb-4 scrollbar-hide">
         {(photos || []).map((photo, index) => (
           <div key={index} className="flex-shrink-0">
             <div className="bg-black p-2 rounded">
               {photo.url ? (
                 <img
                   src={photo.url}
                   alt={photo.caption}
                   className="h-48 w-72 object-cover"
                   loading="lazy"
                 />
               ) : (
                 <div className="flex h-48 w-72 items-center justify-center bg-gray-900 text-sm text-gray-500">
                   No image
                 </div>
               )}
             </div>
             <p className="mt-2 text-center text-xs" style={{ color: theme?.accentColor }}>
               {photo.caption}
             </p>
           </div>
         ))}
       </div>
     </div>
   );
 
   const renderMasonryGrid = () => (
     <div ref={gridRef} className="columns-2 gap-4 sm:columns-3">
       {(photos || []).map((photo, index) =>
         photo.url ? (
           <div
             key={index}
             className="group relative mb-4 break-inside-avoid overflow-hidden rounded-lg"
           >
             <img
               src={photo.url}
               alt={photo.caption}
               className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
               loading="lazy"
             />
             {photo.caption && (
               <div 
                 className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
               >
                 <p className="p-4 text-sm text-white">{photo.caption}</p>
               </div>
             )}
           </div>
         ) : null
       )}
     </div>
   );
 
   const renderDefaultGrid = () => (
     <div ref={gridRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
       {(photos || []).map((photo, index) =>
         photo.url ? (
           <div
             key={index}
             className="group relative aspect-square overflow-hidden rounded-lg bg-black/10"
           >
             <img
               src={photo.url}
               alt={photo.caption}
               className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
               loading="lazy"
             />
             {photo.caption && (
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                 <p className="text-sm">{photo.caption}</p>
               </div>
             )}
           </div>
         ) : (
           <div
             key={index}
             className="flex aspect-square items-center justify-center rounded-lg bg-black/5 text-sm opacity-50"
           >
             No image
           </div>
         )
       )}
     </div>
   );
 
   return (
     <div
       ref={containerRef}
       className="min-h-full w-full px-4 py-12"
       style={{
         backgroundColor: theme?.background || '#f8f9fa',
         color: theme?.textColor || '#1a1a1a',
       }}
     >
       <div className="mx-auto max-w-4xl">
         {/* Header */}
         <div ref={headerRef} className="mb-8 text-center">
           <h1 className={`font-bold ${isPolaroid ? 'font-handwriting text-4xl' : 'text-3xl'}`}>
             {header?.title || 'My Gallery'}
           </h1>
           {header?.description && (
             <p className="mt-2 text-sm opacity-70">{header.description}</p>
           )}
         </div>
 
         {/* Photo Grid */}
         {isPolaroid && renderPolaroidGallery()}
         {isFilmStrip && renderFilmStrip()}
         {isMasonryDark && renderMasonryGrid()}
         {!isPolaroid && !isFilmStrip && !isMasonryDark && renderDefaultGrid()}
       </div>
     </div>
   );
 }