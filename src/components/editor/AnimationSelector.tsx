// Animation Preset Selector for Editor
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Waves, 
  Wind, 
  Flame,
  Snowflake,
  Heart,
  Star,
  Moon,
  Sun,
  Cloud,
  Droplets,
  Play,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export interface AnimationPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'entrance' | 'hover' | 'scroll' | 'continuous' | 'special';
  description: string;
  cssClass?: string;
  gsapConfig?: {
    from: Record<string, unknown>;
    to: Record<string, unknown>;
    duration?: number;
    ease?: string;
  };
}

export const ANIMATION_PRESET_LIST: AnimationPreset[] = [
  // Entrance Animations
  {
    id: 'fade-up',
    name: 'Fade Up',
    icon: <Wind className="h-4 w-4" />,
    category: 'entrance',
    description: 'Fade in from below',
    gsapConfig: {
      from: { opacity: 0, y: 30 },
      to: { opacity: 1, y: 0 },
      duration: 0.6,
      ease: 'power3.out',
    },
  },
  {
    id: 'fade-down',
    name: 'Fade Down',
    icon: <Droplets className="h-4 w-4" />,
    category: 'entrance',
    description: 'Fade in from above',
    gsapConfig: {
      from: { opacity: 0, y: -30 },
      to: { opacity: 1, y: 0 },
      duration: 0.6,
      ease: 'power3.out',
    },
  },
  {
    id: 'scale-in',
    name: 'Scale In',
    icon: <Sparkles className="h-4 w-4" />,
    category: 'entrance',
    description: 'Scale up from small',
    gsapConfig: {
      from: { opacity: 0, scale: 0.8 },
      to: { opacity: 1, scale: 1 },
      duration: 0.5,
      ease: 'back.out(1.7)',
    },
  },
  {
    id: 'slide-left',
    name: 'Slide Left',
    icon: <Waves className="h-4 w-4" />,
    category: 'entrance',
    description: 'Slide in from right',
    gsapConfig: {
      from: { opacity: 0, x: 50 },
      to: { opacity: 1, x: 0 },
      duration: 0.6,
      ease: 'power2.out',
    },
  },
  {
    id: 'elastic',
    name: 'Elastic Pop',
    icon: <Zap className="h-4 w-4" />,
    category: 'entrance',
    description: 'Bouncy entrance',
    gsapConfig: {
      from: { opacity: 0, scale: 0.5 },
      to: { opacity: 1, scale: 1 },
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    },
  },
  {
    id: 'blur-in',
    name: 'Blur In',
    icon: <Cloud className="h-4 w-4" />,
    category: 'entrance',
    description: 'Fade in with blur',
    gsapConfig: {
      from: { opacity: 0, filter: 'blur(10px)' },
      to: { opacity: 1, filter: 'blur(0px)' },
      duration: 0.6,
      ease: 'power2.out',
    },
  },

  // Hover Animations
  {
    id: 'hover-lift',
    name: 'Lift',
    icon: <Sun className="h-4 w-4" />,
    category: 'hover',
    description: 'Lift on hover',
    cssClass: 'hover:-translate-y-2 hover:shadow-lg transition-all duration-300',
  },
  {
    id: 'hover-glow',
    name: 'Glow',
    icon: <Flame className="h-4 w-4" />,
    category: 'hover',
    description: 'Glow effect on hover',
    cssClass: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow duration-300',
  },
  {
    id: 'hover-scale',
    name: 'Scale',
    icon: <Star className="h-4 w-4" />,
    category: 'hover',
    description: 'Scale up on hover',
    cssClass: 'hover:scale-105 transition-transform duration-200',
  },
  {
    id: 'hover-tilt',
    name: '3D Tilt',
    icon: <Moon className="h-4 w-4" />,
    category: 'hover',
    description: '3D tilt effect',
  },

  // Continuous Animations
  {
    id: 'pulse',
    name: 'Pulse',
    icon: <Heart className="h-4 w-4" />,
    category: 'continuous',
    description: 'Gentle pulsing',
    cssClass: 'animate-pulse',
  },
  {
    id: 'float',
    name: 'Float',
    icon: <Cloud className="h-4 w-4" />,
    category: 'continuous',
    description: 'Floating up and down',
    cssClass: 'animate-float',
  },
  {
    id: 'spin',
    name: 'Spin',
    icon: <Snowflake className="h-4 w-4" />,
    category: 'continuous',
    description: 'Continuous rotation',
    cssClass: 'animate-spin',
  },
  {
    id: 'shimmer',
    name: 'Shimmer',
    icon: <Sparkles className="h-4 w-4" />,
    category: 'continuous',
    description: 'Shimmer effect',
    cssClass: 'animate-shimmer',
  },

  // Scroll Animations
  {
    id: 'scroll-reveal',
    name: 'Scroll Reveal',
    icon: <Waves className="h-4 w-4" />,
    category: 'scroll',
    description: 'Reveal on scroll',
  },
  {
    id: 'parallax',
    name: 'Parallax',
    icon: <Wind className="h-4 w-4" />,
    category: 'scroll',
    description: 'Parallax movement',
  },

  // Special Effects
  {
    id: 'typewriter',
    name: 'Typewriter',
    icon: <Zap className="h-4 w-4" />,
    category: 'special',
    description: 'Type text character by character',
  },
  {
    id: 'magnetic',
    name: 'Magnetic',
    icon: <Star className="h-4 w-4" />,
    category: 'special',
    description: 'Follows cursor',
  },
];

interface AnimationSelectorProps {
  value: string[];
  onChange: (animations: string[]) => void;
  maxSelections?: number;
}

export function AnimationSelector({
  value,
  onChange,
  maxSelections = 3,
}: AnimationSelectorProps) {
  const [previewAnimation, setPreviewAnimation] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('entrance');

  const categories = [
    { id: 'entrance', label: 'Entrance', icon: <Play className="h-3 w-3" /> },
    { id: 'hover', label: 'Hover', icon: <Star className="h-3 w-3" /> },
    { id: 'continuous', label: 'Loop', icon: <Sparkles className="h-3 w-3" /> },
    { id: 'scroll', label: 'Scroll', icon: <Waves className="h-3 w-3" /> },
    { id: 'special', label: 'Special', icon: <Zap className="h-3 w-3" /> },
  ];

  const filteredPresets = ANIMATION_PRESET_LIST.filter(
    (p) => p.category === activeCategory
  );

  const toggleAnimation = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else if (value.length < maxSelections) {
      onChange([...value, id]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all',
              activeCategory === cat.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {cat.icon}
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Animation Grid */}
      <div className="grid grid-cols-2 gap-2">
        {filteredPresets.map((preset) => {
          const isSelected = value.includes(preset.id);
          const isDisabled = !isSelected && value.length >= maxSelections;

          return (
            <motion.button
              key={preset.id}
              onClick={() => !isDisabled && toggleAnimation(preset.id)}
              onMouseEnter={() => setPreviewAnimation(preset.id)}
              onMouseLeave={() => setPreviewAnimation(null)}
              className={cn(
                'relative p-3 rounded-lg border text-left transition-all',
                isSelected
                  ? 'border-primary bg-primary/10'
                  : isDisabled
                  ? 'border-border opacity-50 cursor-not-allowed'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              )}
              whileTap={!isDisabled ? { scale: 0.98 } : undefined}
            >
              <div className="flex items-start gap-2">
                <div
                  className={cn(
                    'p-1.5 rounded-md',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  {preset.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium truncate">{preset.name}</span>
                    {isSelected && (
                      <Check className="h-3 w-3 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {preset.description}
                  </p>
                </div>
              </div>

              {/* Preview indicator */}
              {previewAnimation === preset.id && (
                <motion.div
                  layoutId="preview-indicator"
                  className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selection Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {value.length} of {maxSelections} animations selected
        </span>
        {value.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-destructive hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

// ============= Animation Speed Control =============
interface AnimationSpeedControlProps {
  value: number;
  onChange: (speed: number) => void;
}

export function AnimationSpeedControl({ value, onChange }: AnimationSpeedControlProps) {
  const speedLabels = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'];
  const speedValues = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center gap-2">
          <Zap className="h-3 w-3 text-muted-foreground" />
          Animation Speed
        </Label>
        <span className="text-xs text-muted-foreground font-mono">
          {value}x
        </span>
      </div>
      <Slider
        value={[speedValues.indexOf(value) !== -1 ? speedValues.indexOf(value) : 2]}
        onValueChange={([i]) => onChange(speedValues[i])}
        min={0}
        max={speedValues.length - 1}
        step={1}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        {speedLabels.map((label, i) => (
          <span
            key={label}
            className={cn(
              value === speedValues[i] && 'text-primary font-medium'
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
