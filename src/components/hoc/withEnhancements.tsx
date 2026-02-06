// Higher-Order Components for enhanced functionality
import React, { ComponentType, useEffect, useRef, useState } from 'react';
import { motion, MotionProps, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { useBreakpoint, useTouchDevice, useInView } from '@/hooks/useAnimations';
import { cn } from '@/lib/utils';

// ============= WithAnimation HOC =============
export interface AnimationConfig {
  type?: 'fade' | 'slide' | 'scale' | 'rotate' | 'blur';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

export function withAnimation<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: AnimationConfig = {}
) {
  const {
    type = 'fade',
    direction = 'up',
    duration = 0.6,
    delay = 0,
    ease = 'power3.out',
  } = config;

  return function AnimatedComponent(props: P & { className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
      if (!ref.current || shouldReduceMotion) return;

      const element = ref.current;
      const from: gsap.TweenVars = { opacity: 0 };

      switch (type) {
        case 'slide':
          if (direction === 'up') from.y = 40;
          else if (direction === 'down') from.y = -40;
          else if (direction === 'left') from.x = 40;
          else if (direction === 'right') from.x = -40;
          break;
        case 'scale':
          from.scale = 0.8;
          break;
        case 'rotate':
          from.rotation = direction === 'left' ? -10 : 10;
          break;
        case 'blur':
          from.filter = 'blur(10px)';
          break;
      }

      gsap.fromTo(element, from, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        filter: 'none',
        duration,
        delay,
        ease,
      });
    }, [shouldReduceMotion]);

    return (
      <div ref={ref} style={{ opacity: shouldReduceMotion ? 1 : 0 }}>
        <WrappedComponent {...props} />
      </div>
    );
  };
}

// ============= WithResponsive HOC =============
export interface ResponsiveConfig {
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
  mobileProps?: Record<string, unknown>;
  tabletProps?: Record<string, unknown>;
  desktopProps?: Record<string, unknown>;
}

export function withResponsive<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: ResponsiveConfig = {}
) {
  return function ResponsiveComponent(props: P) {
    const breakpoint = useBreakpoint();
    const isMobile = ['xs', 'sm'].includes(breakpoint);
    const isTablet = breakpoint === 'md';
    const isDesktop = ['lg', 'xl', '2xl'].includes(breakpoint);

    if (config.hideOnMobile && isMobile) return null;
    if (config.hideOnDesktop && isDesktop) return null;

    const responsiveProps = {
      ...props,
      ...(isMobile && config.mobileProps),
      ...(isTablet && config.tabletProps),
      ...(isDesktop && config.desktopProps),
    };

    return <WrappedComponent {...(responsiveProps as P)} />;
  };
}

// ============= WithAccessibility HOC =============
export interface AccessibilityConfig {
  role?: string;
  label?: string;
  description?: string;
  focusable?: boolean;
  announcement?: string;
}

export function withAccessibility<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: AccessibilityConfig = {}
) {
  return function AccessibleComponent(props: P & { className?: string }) {
    const { role, label, description, focusable = true, announcement } = config;

    return (
      <div
        role={role}
        aria-label={label}
        aria-describedby={description ? 'desc' : undefined}
        tabIndex={focusable ? 0 : -1}
        className={cn(
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          props.className
        )}
      >
        {description && (
          <span id="desc" className="sr-only">
            {description}
          </span>
        )}
        {announcement && (
          <span role="status" aria-live="polite" className="sr-only">
            {announcement}
          </span>
        )}
        <WrappedComponent {...props} />
      </div>
    );
  };
}

// ============= WithScrollTrigger HOC =============
export function withScrollTrigger<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: {
    threshold?: number;
    once?: boolean;
    animation?: 'fade' | 'slide' | 'scale';
  }
) {
  return function ScrollTriggeredComponent(props: P) {
    const { ref, isInView } = useInView<HTMLDivElement>({
      threshold: options?.threshold ?? 0.1,
      once: options?.once ?? true,
    });

    const animationClass = (() => {
      if (!isInView) return 'opacity-0 translate-y-8';
      return 'opacity-100 translate-y-0';
    })();

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-700 ease-out',
          animationClass
        )}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
}

// ============= WithHoverEffect HOC =============
export type HoverEffect = 'lift' | 'glow' | 'scale' | 'tilt' | 'shine';

export function withHoverEffect<P extends object>(
  WrappedComponent: ComponentType<P>,
  effect: HoverEffect = 'lift'
) {
  return function HoverEffectComponent(props: P & { className?: string }) {
    const isTouch = useTouchDevice();
    
    if (isTouch) {
      // Simplified effect for touch devices
      return (
        <div className="active:scale-[0.98] transition-transform">
          <WrappedComponent {...props} />
        </div>
      );
    }

    const effectClasses = {
      lift: 'hover:-translate-y-1 hover:shadow-lg',
      glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]',
      scale: 'hover:scale-[1.02]',
      tilt: '', // Handled by motion
      shine: 'overflow-hidden relative',
    };

    if (effect === 'tilt') {
      return (
        <motion.div
          whileHover={{ rotateX: 5, rotateY: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{ transformPerspective: 1000 }}
        >
          <WrappedComponent {...props} />
        </motion.div>
      );
    }

    if (effect === 'shine') {
      return (
        <div className={cn('group', effectClasses.shine, props.className)}>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
          <WrappedComponent {...props} />
        </div>
      );
    }

    return (
      <div
        className={cn(
          'transition-all duration-300',
          effectClasses[effect],
          props.className
        )}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
}

// ============= WithBreakpointAware HOC =============
export function withBreakpointAware<P extends { size?: string }>(
  WrappedComponent: ComponentType<P>
) {
  return function BreakpointAwareComponent(props: Omit<P, 'size'>) {
    const breakpoint = useBreakpoint();
    
    const sizeMap: Record<string, string> = {
      xs: 'sm',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'lg',
      '2xl': 'lg',
    };

    return <WrappedComponent {...(props as P)} size={sizeMap[breakpoint]} />;
  };
}

// ============= Composed HOC =============
export function compose<P extends object>(
  ...hocs: Array<(component: ComponentType<P>) => ComponentType<P>>
) {
  return (WrappedComponent: ComponentType<P>) =>
    hocs.reduceRight((acc, hoc) => hoc(acc), WrappedComponent);
}
