// Animation Library - Pre-built animation components
import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

// ============= Scroll Reveal =============
interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px' });

  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ============= Stagger Container =============
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: staggerDelay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: 'spring', stiffness: 100, damping: 15 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ============= Parallax Layer =============
interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxLayer({ children, speed = 0.5, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const ctx = gsap.context(() => {
      gsap.to(element, {
        y: 100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ============= Text Reveal =============
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  variant?: 'char' | 'word' | 'line';
}

export function TextReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.03,
  variant = 'char',
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const getItems = () => {
    switch (variant) {
      case 'word':
        return text.split(' ');
      case 'line':
        return text.split('\n');
      default:
        return text.split('');
    }
  };

  const items = getItems();
  const separator = variant === 'word' ? ' ' : variant === 'line' ? '\n' : '';

  return (
    <motion.div
      ref={ref}
      className={cn('inline-flex flex-wrap', className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: delay },
        },
      }}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          className={variant === 'char' ? 'inline-block' : 'inline-block mr-1'}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {item === ' ' ? '\u00A0' : item}
          {separator}
        </motion.span>
      ))}
    </motion.div>
  );
}

// ============= Magnetic Element =============
interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn('inline-block', className)}>
      {children}
    </div>
  );
}

// ============= Hover Card Effect =============
interface HoverCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

export function HoverCard3D({
  children,
  className,
  intensity = 15,
  glare = true,
}: HoverCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (y - 0.5) * intensity;
      const rotateY = (x - 0.5) * -intensity;

      gsap.to(element, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      });

      if (glare && glareRef.current) {
        gsap.to(glareRef.current, {
          opacity: 0.3,
          x: `${x * 100}%`,
          y: `${y * 100}%`,
          duration: 0.3,
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });

      if (glare && glareRef.current) {
        gsap.to(glareRef.current, { opacity: 0, duration: 0.3 });
      }
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, glare]);

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 50%)',
            transform: 'translate(-50%, -50%)',
            width: '200%',
            height: '200%',
          }}
        />
      )}
    </div>
  );
}

// ============= Animated Counter =============
interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  className,
  suffix = '',
  prefix = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!ref.current || !isInView) return;

    const element = ref.current;
    const counter = { value: from };

    gsap.to(counter, {
      value: to,
      duration,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
      },
    });
  }, [from, to, duration, delay, isInView, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}{from}{suffix}
    </span>
  );
}

// ============= Morphing Shape =============
interface MorphingShapeProps {
  className?: string;
  color?: string;
  size?: number;
}

export function MorphingShape({
  className,
  color = 'hsl(var(--primary))',
  size = 200,
}: MorphingShapeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(element, {
      borderRadius: '50%',
      duration: 4,
      ease: 'sine.inOut',
    })
    .to(element, {
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
      duration: 4,
      ease: 'sine.inOut',
    });

    gsap.to(element, {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
      }}
    />
  );
}

// ============= Floating Elements =============
interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function FloatingElement({
  children,
  className,
  amplitude = 10,
  duration = 3,
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// ============= Animated Gradient Text =============
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animated?: boolean;
}

export function GradientText({
  children,
  className,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#3b82f6'],
  animated = true,
}: GradientTextProps) {
  return (
    <motion.span
      className={cn('bg-clip-text text-transparent bg-gradient-to-r', className)}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: animated ? '200% 100%' : '100% 100%',
      }}
      animate={
        animated
          ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }
          : undefined
      }
      transition={
        animated
          ? {
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }
          : undefined
      }
    >
      {children}
    </motion.span>
  );
}

// ============= Spotlight Effect =============
interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
}

export function Spotlight({ children, className, size = 400 }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !spotlightRef.current) return;

    const container = containerRef.current;
    const spotlight = spotlightRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlight.style.background = `radial-gradient(${size}px circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 80%)`;
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 transition-opacity"
      />
      {children}
    </div>
  );
}
