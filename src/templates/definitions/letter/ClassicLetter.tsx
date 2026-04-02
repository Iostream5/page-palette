import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LetterData } from '@/types/builder';
import { EditorProps } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThemeControls } from '@/components/editor/ThemeControls';

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

export function ClassicLetterEditor({
  data,
  updateField,
}: EditorProps) {
  return (
    <div className="space-y-6 pb-20">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Letter Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={data.letter?.title || ''}
              onChange={(e) => updateField('letter.title', e.target.value)}
              placeholder="Letter title"
            />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              value={data.letter?.date || ''}
              onChange={(e) => updateField('letter.date', e.target.value)}
              placeholder="February 2026"
            />
          </div>
          <div className="space-y-2">
            <Label>Greeting</Label>
            <Input
              value={data.letter?.greeting || ''}
              onChange={(e) => updateField('letter.greeting', e.target.value)}
              placeholder="Dear Reader,"
            />
          </div>
          <div className="space-y-2">
            <Label>Body</Label>
            <Textarea
              value={data.letter?.body || ''}
              onChange={(e) => updateField('letter.body', e.target.value)}
              placeholder="Write your letter..."
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <Label>Closing</Label>
            <Input
              value={data.letter?.closing || ''}
              onChange={(e) => updateField('letter.closing', e.target.value)}
              placeholder="With warm regards,"
            />
          </div>
          <div className="space-y-2">
            <Label>Signature</Label>
            <Input
              value={data.letter?.signature || ''}
              onChange={(e) => updateField('letter.signature', e.target.value)}
              placeholder="Your Name"
            />
          </div>
        </CardContent>
      </Card>

      <ThemeControls
        theme={data.theme || {}}
        updateField={updateField}
        category="letter"
      />
    </div>
  );
}
