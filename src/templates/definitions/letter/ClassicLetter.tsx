import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LetterData } from '@/types/builder';

interface ClassicLetterProps {
  data: LetterData;
}

export default function ClassicLetter({ data }: ClassicLetterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { letter, theme } = data;
  const animationSpeed = theme?.animationSpeed ?? 1;

  useEffect(() => {
    if (!containerRef.current) return;
    const speed = 1 / animationSpeed;

    const ctx = gsap.context(() => {
      gsap.fromTo('.letter-content > *',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 * speed, stagger: 0.1, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [animationSpeed]);

  return (
    <div
      ref={containerRef}
      className="min-h-full w-full py-16 px-6"
      style={{
        backgroundColor: theme?.background || '#fffef0',
        color: theme?.textColor || '#2d3436',
        fontFamily: theme?.fontFamily || 'serif',
      }}
    >
      <div className="mx-auto max-w-2xl letter-content space-y-8">
        <div className="text-right opacity-60">
          <p>{letter?.date || 'February 2026'}</p>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold italic">{letter?.title || 'A Special Message'}</h1>
          <p className="text-xl">{letter?.greeting || 'Dear Reader,'}</p>
        </div>

        <div className="text-lg leading-relaxed space-y-4 whitespace-pre-wrap">
          {letter?.body || 'Write your letter here...'}
        </div>

        <div className="pt-8 space-y-2">
          <p className="text-xl italic">{letter?.closing || 'With warm regards,'}</p>
          <p className="text-2xl font-bold font-handwriting">{letter?.signature || 'Your Name'}</p>
        </div>
      </div>
    </div>
  );
}
