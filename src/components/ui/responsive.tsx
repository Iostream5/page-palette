// Responsive Container Component
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useBreakpoint, useTouchDevice, useReducedMotion } from '@/hooks/useAnimations';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  animate?: boolean;
}

const paddingClasses = {
  none: 'p-0',
  sm: 'px-4 py-2 md:px-6 md:py-4',
  md: 'px-4 py-4 md:px-8 md:py-6 lg:px-10 lg:py-8',
  lg: 'px-6 py-6 md:px-10 md:py-8 lg:px-16 lg:py-12',
};

const maxWidthClasses = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

export function ResponsiveContainer({
  children,
  className,
  as: Component = 'div',
  padding = 'md',
  maxWidth = 'full',
  animate = false,
}: ResponsiveContainerProps) {
  const reducedMotion = useReducedMotion();

  if (animate && !reducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'w-full mx-auto',
          paddingClasses[padding],
          maxWidthClasses[maxWidth],
          className
        )}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component
      className={cn(
        'w-full mx-auto',
        paddingClasses[padding],
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </Component>
  );
}

// ============= Responsive Grid =============
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2 md:gap-3',
  md: 'gap-4 md:gap-6',
  lg: 'gap-6 md:gap-8 lg:gap-10',
};

export function ResponsiveGrid({
  children,
  className,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
}: ResponsiveGridProps) {
  const colClasses = [
    cols.xs && `grid-cols-${cols.xs}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean);

  return (
    <div className={cn('grid', gapClasses[gap], ...colClasses, className)}>
      {children}
    </div>
  );
}

// ============= Touch-Friendly Button Wrapper =============
interface TouchFriendlyProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function TouchFriendly({
  children,
  className,
  onClick,
  disabled,
}: TouchFriendlyProps) {
  const isTouch = useTouchDevice();
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      className={cn(
        'touch-manipulation select-none',
        isTouch && 'min-h-[44px] min-w-[44px]', // WCAG touch target size
        className
      )}
      onClick={onClick}
      disabled={disabled}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.button>
  );
}

// ============= Screen Reader Only =============
interface SROnlyProps {
  children: React.ReactNode;
  as?: 'span' | 'div' | 'p';
}

export function SROnly({ children, as: Component = 'span' }: SROnlyProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}

// ============= Skip Link =============
export function SkipLink({ href = '#main-content' }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
    >
      Skip to main content
    </a>
  );
}

// ============= Focus Trap =============
interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

export function FocusTrap({ children, active = true }: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return <div ref={containerRef}>{children}</div>;
}

// ============= Announce for Screen Readers =============
export function LiveRegion({
  message,
  politeness = 'polite',
}: {
  message: string;
  politeness?: 'polite' | 'assertive';
}) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
