import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ANIMATION_PRESET_LIST = [
  // Entrance Animations
  { id: 'fade-up', name: 'Fade Up', type: 'entrance' },
  { id: 'fade-down', name: 'Fade Down', type: 'entrance' },
  { id: 'fade-left', name: 'Fade Left', type: 'entrance' },
  { id: 'fade-right', name: 'Fade Right', type: 'entrance' },
  { id: 'scale-up', name: 'Scale Up', type: 'entrance' },
  { id: 'blur-in', name: 'Blur In', type: 'entrance' },

  // Hover Animations
  { id: 'hover-lift', name: 'Lift on Hover', type: 'hover' },
  { id: 'hover-scale', name: 'Scale on Hover', type: 'hover' },
  { id: 'hover-glow', name: 'Glow on Hover', type: 'hover' },

  // Loop Animations
  { id: 'float', name: 'Floating', type: 'loop' },
  { id: 'pulse', name: 'Pulse', type: 'loop' },
  { id: 'spin', name: 'Slow Spin', type: 'loop' },
];

interface AnimationSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
}

export function AnimationSelector({ value, onChange, maxSelections = 4 }: AnimationSelectorProps) {
  const toggleAnimation = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((a) => a !== id));
    } else if (value.length < maxSelections) {
      onChange([...value, id]);
    }
  };

  const getByType = (type: string) => ANIMATION_PRESET_LIST.filter((a) => a.type === type);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h5 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Entrance</h5>
        <div className="grid grid-cols-2 gap-2">
          {getByType('entrance').map((anim) => (
            <AnimationButton
              key={anim.id}
              anim={anim}
              isSelected={value.includes(anim.id)}
              onClick={() => toggleAnimation(anim.id)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Interactive</h5>
        <div className="grid grid-cols-2 gap-2">
          {getByType('hover').map((anim) => (
            <AnimationButton
              key={anim.id}
              anim={anim}
              isSelected={value.includes(anim.id)}
              onClick={() => toggleAnimation(anim.id)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Continuous</h5>
        <div className="grid grid-cols-2 gap-2">
          {getByType('loop').map((anim) => (
            <AnimationButton
              key={anim.id}
              anim={anim}
              isSelected={value.includes(anim.id)}
              onClick={() => toggleAnimation(anim.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimationButton({ anim, isSelected, onClick }: { anim: any; isSelected: boolean; onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "h-9 justify-start gap-2 px-2 text-xs transition-all",
        isSelected && "border-primary bg-primary/5 text-primary ring-1 ring-primary"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-input transition-colors",
        isSelected && "bg-primary border-primary"
      )}>
        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>
      <span className="truncate">{anim.name}</span>
    </Button>
  );
}

export function AnimationSpeedControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">Animation Speed</Label>
        <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{value}s</span>
      </div>
      <div className="pt-2">
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">Fast</span>
          <span className="text-[10px] text-muted-foreground">Slow</span>
        </div>
      </div>
    </div>
  );
}
