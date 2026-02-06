// Animated Progress Indicators
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============= Progress Bar =============
interface AnimatedProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'gradient' | 'striped' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

export function AnimatedProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showValue = false,
  animated = true,
  className,
}: AnimatedProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getBarStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]';
      case 'striped':
        return 'bg-primary bg-stripes';
      case 'glow':
        return 'bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'w-full rounded-full bg-muted overflow-hidden',
          sizeClasses[size]
        )}
      >
        <motion.div
          className={cn(
            'h-full rounded-full',
            getBarStyles(),
            variant === 'gradient' && animated && 'animate-gradient-x'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      {showValue && (
        <motion.span
          className="absolute -top-6 text-sm font-medium text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, left: `${Math.min(percentage, 95)}%` }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(percentage)}%
        </motion.span>
      )}
    </div>
  );
}

// ============= Circular Progress =============
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'gradient' | 'glow';
  showValue?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'default',
  showValue = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variant === 'gradient' ? 'url(#gradient)' : 'currentColor'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(
            variant !== 'gradient' && 'text-primary',
            variant === 'glow' && 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
          )}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        {variant === 'gradient' && (
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        )}
      </svg>
      {showValue && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-lg font-semibold text-foreground">
            {Math.round(percentage)}%
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ============= Spinner Variants =============
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'ring';
  color?: string;
  className?: string;
}

export function Spinner({ 
  size = 'md', 
  variant = 'default',
  className 
}: SpinnerProps) {
  const sizeMap = { sm: 16, md: 24, lg: 40 };
  const s = sizeMap[size];

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('relative', className)} style={{ width: s, height: s }}>
        <motion.div
          className="absolute inset-0 rounded-full bg-primary"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <div 
          className="absolute inset-[25%] rounded-full bg-primary"
        />
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={cn('flex items-end gap-1', className)} style={{ height: s }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-primary rounded-full"
            animate={{
              height: ['40%', '100%', '40%'],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'ring') {
    return (
      <div className={cn('relative', className)} style={{ width: s, height: s }}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-muted"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  // Default spinner
  return (
    <motion.svg
      className={cn('text-primary', className)}
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

// ============= Skeleton Loader =============
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: number | string;
  height?: number | string;
  className?: string;
  animated?: boolean;
}

export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className,
  animated = true,
}: SkeletonProps) {
  const getShapeClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded h-4';
      case 'circular':
        return 'rounded-full aspect-square';
      case 'rounded':
        return 'rounded-xl';
      default:
        return 'rounded-md';
    }
  };

  return (
    <motion.div
      className={cn(
        'bg-muted',
        getShapeClasses(),
        animated && 'animate-pulse',
        className
      )}
      style={{ width, height }}
    />
  );
}

// ============= Step Progress =============
interface StepProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <motion.div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2',
                index < currentStep
                  ? 'bg-primary border-primary text-primary-foreground'
                  : index === currentStep
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-muted text-muted-foreground'
              )}
              initial={false}
              animate={{
                scale: index === currentStep ? 1.1 : 1,
                transition: { type: 'spring', stiffness: 300 },
              }}
            >
              {index < currentStep ? (
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path d="M20 6L9 17l-5-5" />
                </motion.svg>
              ) : (
                index + 1
              )}
            </motion.div>
            <span className="mt-2 text-xs text-muted-foreground">{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-4 bg-muted relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary"
                initial={{ width: '0%' }}
                animate={{
                  width: index < currentStep ? '100%' : '0%',
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
