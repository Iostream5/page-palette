// Unified Animation System - GSAP + Framer Motion + CSS
import gsap from 'gsap';

// ============= Animation Presets =============
export const ANIMATION_PRESETS = {
  // Fade animations
  fadeIn: { opacity: 0, y: 20 },
  fadeInUp: { opacity: 0, y: 40 },
  fadeInDown: { opacity: 0, y: -40 },
  fadeInLeft: { opacity: 0, x: -40 },
  fadeInRight: { opacity: 0, x: 40 },
  
  // Scale animations
  scaleIn: { opacity: 0, scale: 0.8 },
  scaleInBounce: { opacity: 0, scale: 0.5 },
  
  // Rotate animations
  rotateIn: { opacity: 0, rotation: -10 },
  flipIn: { opacity: 0, rotationY: 90 },
  
  // Slide animations
  slideInLeft: { x: '-100%', opacity: 0 },
  slideInRight: { x: '100%', opacity: 0 },
  slideInUp: { y: '100%', opacity: 0 },
  slideInDown: { y: '-100%', opacity: 0 },
  
  // Special effects
  blur: { filter: 'blur(10px)', opacity: 0 },
  glow: { filter: 'brightness(2)', opacity: 0 },
  elastic: { scale: 0, ease: 'elastic.out(1, 0.5)' },
} as const;

// ============= Easing Functions =============
export const EASINGS = {
  // Standard easings
  linear: 'none',
  easeIn: 'power2.in',
  easeOut: 'power2.out',
  easeInOut: 'power2.inOut',
  
  // Dramatic easings
  smooth: 'power3.out',
  bounce: 'bounce.out',
  elastic: 'elastic.out(1, 0.3)',
  back: 'back.out(1.7)',
  
  // Custom bezier-like
  snappy: 'power4.out',
  gentle: 'power1.out',
  expo: 'expo.out',
} as const;

// ============= GSAP Timeline Factory =============
export function createTimeline(options?: gsap.TimelineVars) {
  return gsap.timeline({
    defaults: {
      duration: 0.6,
      ease: EASINGS.smooth,
    },
    ...options,
  });
}

// ============= Animation Sequences =============
export function animateStagger(
  elements: gsap.TweenTarget,
  from: gsap.TweenVars,
  options: {
    stagger?: number;
    duration?: number;
    ease?: string;
    delay?: number;
  } = {}
) {
  const { stagger = 0.1, duration = 0.6, ease = EASINGS.smooth, delay = 0 } = options;
  
  return gsap.fromTo(
    elements,
    from,
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      filter: 'none',
      duration,
      ease,
      stagger,
      delay,
    }
  );
}

// ============= Scroll-triggered Animation Helpers =============
export function createScrollAnimation(
  element: gsap.TweenTarget,
  animation: keyof typeof ANIMATION_PRESETS,
  options: {
    duration?: number;
    ease?: string;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {}
) {
  const {
    duration = 0.8,
    ease = EASINGS.smooth,
    start = 'top 80%',
    end = 'top 20%',
    scrub = false,
  } = options;

  return gsap.fromTo(
    element,
    ANIMATION_PRESETS[animation],
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      rotationY: 0,
      filter: 'none',
      duration,
      ease,
      scrollTrigger: {
        trigger: element as Element,
        start,
        end,
        scrub,
      },
    }
  );
}

// ============= Micro-interactions =============
export function hoverScale(element: HTMLElement, scale = 1.05) {
  const tl = gsap.timeline({ paused: true });
  tl.to(element, { scale, duration: 0.2, ease: EASINGS.back });
  
  element.addEventListener('mouseenter', () => tl.play());
  element.addEventListener('mouseleave', () => tl.reverse());
  
  return () => {
    element.removeEventListener('mouseenter', () => tl.play());
    element.removeEventListener('mouseleave', () => tl.reverse());
  };
}

export function clickPulse(element: HTMLElement) {
  element.addEventListener('click', () => {
    gsap.fromTo(
      element,
      { scale: 1 },
      { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: EASINGS.easeInOut }
    );
  });
}

// ============= Parallax Helper =============
export function createParallax(
  element: gsap.TweenTarget,
  speed = 0.5,
  direction: 'vertical' | 'horizontal' = 'vertical'
) {
  const prop = direction === 'vertical' ? 'y' : 'x';
  const distance = 100 * speed;
  
  return gsap.to(element, {
    [prop]: distance,
    ease: 'none',
    scrollTrigger: {
      trigger: element as Element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

// ============= Loading Animation Sequences =============
export const loadingAnimations = {
  pulse: (element: gsap.TweenTarget) => {
    return gsap.to(element, {
      scale: 1.1,
      opacity: 0.7,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: EASINGS.easeInOut,
    });
  },
  
  spin: (element: gsap.TweenTarget) => {
    return gsap.to(element, {
      rotation: 360,
      duration: 1,
      repeat: -1,
      ease: EASINGS.linear,
    });
  },
  
  bounce: (element: gsap.TweenTarget) => {
    return gsap.to(element, {
      y: -10,
      duration: 0.4,
      repeat: -1,
      yoyo: true,
      ease: EASINGS.easeInOut,
    });
  },
  
  shimmer: (element: gsap.TweenTarget) => {
    return gsap.fromTo(
      element,
      { backgroundPosition: '-200% 0' },
      {
        backgroundPosition: '200% 0',
        duration: 1.5,
        repeat: -1,
        ease: EASINGS.linear,
      }
    );
  },
};

// ============= Transition Effects =============
export const transitions = {
  crossfade: (outElement: gsap.TweenTarget, inElement: gsap.TweenTarget, duration = 0.5) => {
    const tl = createTimeline();
    tl.to(outElement, { opacity: 0, duration: duration / 2 });
    tl.fromTo(inElement, { opacity: 0 }, { opacity: 1, duration: duration / 2 }, '-=0.1');
    return tl;
  },
  
  slideReplace: (outElement: gsap.TweenTarget, inElement: gsap.TweenTarget, direction = 'left') => {
    const tl = createTimeline();
    const xOut = direction === 'left' ? -100 : 100;
    const xIn = direction === 'left' ? 100 : -100;
    
    tl.to(outElement, { x: `${xOut}%`, opacity: 0, duration: 0.4 });
    tl.fromTo(inElement, { x: `${xIn}%`, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, '-=0.2');
    return tl;
  },
  
  scaleReplace: (outElement: gsap.TweenTarget, inElement: gsap.TweenTarget) => {
    const tl = createTimeline();
    tl.to(outElement, { scale: 0.8, opacity: 0, duration: 0.3 });
    tl.fromTo(inElement, { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 }, '-=0.1');
    return tl;
  },
};

// ============= Framer Motion Variants =============
export const framerVariants = {
  // Container variants for staggered children
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  
  // Child variants
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  },
  
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
  },
  
  slideIn: {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  },
  
  // Hover variants
  hoverLift: {
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -5, 
      scale: 1.02,
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
  },
  
  hoverGlow: {
    rest: { boxShadow: '0 0 0 rgba(0,0,0,0)' },
    hover: { 
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      transition: { duration: 0.3 },
    },
  },
  
  // Tap variants
  tapScale: {
    rest: { scale: 1 },
    tap: { scale: 0.95 },
  },
  
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
};

// ============= CSS Animation Classes Generator =============
export function generateAnimationStyle(
  animation: string,
  duration = 0.6,
  delay = 0,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
): React.CSSProperties {
  return {
    animation: `${animation} ${duration}s ${easing} ${delay}s both`,
  };
}
