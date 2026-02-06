// Animation Hooks - GSAP + Framer Motion integration
import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANIMATION_PRESETS, EASINGS, createTimeline, animateStagger } from '@/lib/animations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============= useGSAP Hook =============
export function useGSAP<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    return () => {
      timeline.current?.kill();
    };
  }, []);

  const animate = useCallback((
    animation: keyof typeof ANIMATION_PRESETS | gsap.TweenVars,
    options?: {
      duration?: number;
      delay?: number;
      ease?: string;
      onComplete?: () => void;
    }
  ) => {
    if (!ref.current) return;

    const from = typeof animation === 'string' 
      ? ANIMATION_PRESETS[animation] 
      : animation;

    return gsap.fromTo(ref.current, from, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      filter: 'none',
      duration: options?.duration ?? 0.6,
      delay: options?.delay ?? 0,
      ease: options?.ease ?? EASINGS.smooth,
      onComplete: options?.onComplete,
    });
  }, []);

  const createTl = useCallback((options?: gsap.TimelineVars) => {
    timeline.current = createTimeline(options);
    return timeline.current;
  }, []);

  return { ref, animate, createTl, timeline };
}

// ============= useScrollAnimation Hook =============
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  animation: keyof typeof ANIMATION_PRESETS = 'fadeInUp',
  options?: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    markers?: boolean;
    once?: boolean;
  }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const {
      start = 'top 85%',
      end = 'top 20%',
      scrub = false,
      markers = false,
      once = true,
    } = options ?? {};

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        ANIMATION_PRESETS[animation],
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          filter: 'none',
          duration: 0.8,
          ease: EASINGS.smooth,
          scrollTrigger: {
            trigger: ref.current,
            start,
            end,
            scrub,
            markers,
            once,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [animation, options]);

  return ref;
}

// ============= useStaggerAnimation Hook =============
export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
  selector: string,
  animation: keyof typeof ANIMATION_PRESETS = 'fadeInUp',
  options?: {
    stagger?: number;
    duration?: number;
    delay?: number;
    ease?: string;
  }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const elements = ref.current.querySelectorAll(selector);
    if (!elements.length) return;

    const ctx = gsap.context(() => {
      animateStagger(elements, ANIMATION_PRESETS[animation], {
        stagger: options?.stagger ?? 0.1,
        duration: options?.duration ?? 0.6,
        ease: options?.ease ?? EASINGS.smooth,
        delay: options?.delay ?? 0,
      });
    });

    return () => ctx.revert();
  }, [selector, animation, options]);

  return ref;
}

// ============= useParallax Hook =============
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed = 0.5,
  direction: 'vertical' | 'horizontal' = 'vertical'
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prop = direction === 'vertical' ? 'y' : 'x';
    const distance = 100 * speed;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        [prop]: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed, direction]);

  return ref;
}

// ============= useHoverAnimation Hook =============
export function useHoverAnimation<T extends HTMLElement = HTMLDivElement>(
  hoverAnimation: gsap.TweenVars = { scale: 1.05, duration: 0.2 }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const tl = gsap.timeline({ paused: true });
    tl.to(element, { ...hoverAnimation, ease: EASINGS.back });

    const onEnter = () => tl.play();
    const onLeave = () => tl.reverse();

    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);

    return () => {
      element.removeEventListener('mouseenter', onEnter);
      element.removeEventListener('mouseleave', onLeave);
      tl.kill();
    };
  }, [hoverAnimation]);

  return ref;
}

// ============= useTypingAnimation Hook =============
export function useTypingAnimation(
  text: string,
  options?: {
    speed?: number;
    delay?: number;
    cursor?: boolean;
  }
) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const { speed = 50, delay = 0 } = options ?? {};
    let index = 0;
    let timeout: NodeJS.Timeout;

    const startTyping = () => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(interval);
    };

    timeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [text, options]);

  return { displayText, isComplete };
}

// ============= useInView Hook =============
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
  }
) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const { threshold = 0.1, rootMargin = '0px', once = true } = options ?? {};

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

// ============= useReducedMotion Hook =============
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// ============= useBreakpoint Hook =============
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else if (width < 1536) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
}

// ============= useTouchDevice Hook =============
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}
