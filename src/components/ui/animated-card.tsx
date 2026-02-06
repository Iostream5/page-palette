// Interactive Animated Card Component
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover-lift' | 'hover-glow' | 'hover-tilt' | 'flip' | 'magnetic';
  glowColor?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  className,
  variant = 'default',
  glowColor = 'rgba(59, 130, 246, 0.5)',
  disabled = false,
  onClick,
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // For tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (variant !== 'hover-tilt' || disabled) return;
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (variant === 'hover-tilt') {
      x.set(0);
      y.set(0);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'hover-lift':
        return {
          whileHover: disabled ? {} : { y: -8, scale: 1.02 },
          transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
        };
      case 'hover-glow':
        return {
          whileHover: disabled ? {} : { 
            boxShadow: `0 20px 40px ${glowColor}`,
            scale: 1.02,
          },
          transition: { duration: 0.3 },
        };
      case 'magnetic':
        return {
          whileHover: disabled ? {} : { scale: 1.05 },
          whileTap: disabled ? {} : { scale: 0.98 },
          transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
        };
      default:
        return {};
    }
  };

  if (variant === 'flip') {
    return <FlipCard className={className} disabled={disabled}>{children}</FlipCard>;
  }

  if (variant === 'hover-tilt') {
    return (
      <motion.div
        ref={cardRef}
        className={cn(
          'rounded-xl border border-border bg-card p-6 cursor-pointer transform-gpu',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={disabled ? undefined : onClick}
      >
        <motion.div
          animate={{ 
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'rounded-xl border border-border bg-card p-6 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={disabled ? undefined : onClick}
      {...getVariantStyles()}
    >
      {children}
    </motion.div>
  );
}

// ============= Flip Card =============
interface FlipCardProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  backContent?: React.ReactNode;
}

function FlipCard({ children, className, disabled, backContent }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={cn('perspective-1000 cursor-pointer', className)}
      onClick={() => !disabled && setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-xl border border-border bg-card p-6">
          {children}
        </div>
        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden rounded-xl border border-border bg-card p-6"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {backContent || <div className="text-muted-foreground">Back of card</div>}
        </div>
      </motion.div>
    </div>
  );
}

// ============= Glass Card =============
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
}

export function GlassCard({ 
  children, 
  className, 
  blur = 'lg',
  opacity = 0.1 
}: GlassCardProps) {
  const blurMap = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl border border-white/20 p-6',
        blurMap[blur],
        className
      )}
      style={{ 
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      }}
      whileHover={{ 
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: `rgba(255, 255, 255, ${opacity + 0.05})`,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// ============= Gradient Border Card =============
interface GradientBorderCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColors?: string[];
  animated?: boolean;
}

export function GradientBorderCard({
  children,
  className,
  gradientColors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  animated = true,
}: GradientBorderCardProps) {
  const gradient = `linear-gradient(135deg, ${gradientColors.join(', ')})`;

  return (
    <motion.div
      className={cn('relative p-[2px] rounded-xl overflow-hidden', className)}
      style={{ background: gradient }}
      animate={animated ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      } : undefined}
      transition={animated ? {
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      } : undefined}
    >
      <div className="rounded-[10px] bg-card p-6 h-full">
        {children}
      </div>
    </motion.div>
  );
}
