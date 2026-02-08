// Page Component Types for the Component Library

export type PageComponentType = 
  | 'hero'
  | 'heading'
  | 'text'
  | 'button'
  | 'card'
  | 'image'
  | 'divider'
  | 'spacer'
  | 'icon-list'
  | 'cta'
  | 'testimonial'
  | 'stats'
  | 'feature-grid'
  | 'social-links'
  | 'video'
  | 'countdown'
  | 'pricing'
  | 'faq'
  | 'contact-form'
  | 'newsletter';

export interface PageComponentBase {
  id: string;
  type: PageComponentType;
  order: number;
  visible: boolean;
}

export interface HeroComponent extends PageComponentBase {
  type: 'hero';
  props: {
    title: string;
    subtitle: string;
    backgroundImage?: string;
    backgroundGradient?: string;
    ctaText?: string;
    ctaUrl?: string;
    alignment: 'left' | 'center' | 'right';
    height: 'small' | 'medium' | 'large' | 'full';
  };
}

export interface HeadingComponent extends PageComponentBase {
  type: 'heading';
  props: {
    text: string;
    level: 'h1' | 'h2' | 'h3' | 'h4';
    alignment: 'left' | 'center' | 'right';
    color?: string;
  };
}

export interface TextComponent extends PageComponentBase {
  type: 'text';
  props: {
    content: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
    fontSize: 'small' | 'medium' | 'large';
  };
}

export interface ButtonComponent extends PageComponentBase {
  type: 'button';
  props: {
    text: string;
    url: string;
    variant: 'primary' | 'secondary' | 'outline' | 'ghost';
    size: 'small' | 'medium' | 'large';
    fullWidth: boolean;
    icon?: string;
  };
}

export interface CardComponent extends PageComponentBase {
  type: 'card';
  props: {
    title: string;
    description: string;
    image?: string;
    ctaText?: string;
    ctaUrl?: string;
    variant: 'default' | 'elevated' | 'bordered' | 'glass';
  };
}

export interface ImageComponent extends PageComponentBase {
  type: 'image';
  props: {
    src: string;
    alt: string;
    caption?: string;
    aspectRatio: '1:1' | '16:9' | '4:3' | 'auto';
    rounded: boolean;
    shadow: boolean;
  };
}

export interface DividerComponent extends PageComponentBase {
  type: 'divider';
  props: {
    style: 'solid' | 'dashed' | 'dotted' | 'gradient';
    thickness: 'thin' | 'medium' | 'thick';
    color?: string;
  };
}

export interface SpacerComponent extends PageComponentBase {
  type: 'spacer';
  props: {
    height: 'small' | 'medium' | 'large' | 'xlarge';
  };
}

export interface IconListComponent extends PageComponentBase {
  type: 'icon-list';
  props: {
    items: Array<{
      icon: string;
      text: string;
    }>;
    layout: 'vertical' | 'horizontal';
    iconColor?: string;
  };
}

export interface CTAComponent extends PageComponentBase {
  type: 'cta';
  props: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    variant: 'simple' | 'boxed' | 'gradient';
  };
}

export interface TestimonialComponent extends PageComponentBase {
  type: 'testimonial';
  props: {
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
    rating?: number;
  };
}

export interface StatsComponent extends PageComponentBase {
  type: 'stats';
  props: {
    items: Array<{
      value: string;
      label: string;
      icon?: string;
    }>;
    layout: 'row' | 'grid';
  };
}

export interface FeatureGridComponent extends PageComponentBase {
  type: 'feature-grid';
  props: {
    columns: 2 | 3 | 4;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

export interface SocialLinksComponent extends PageComponentBase {
  type: 'social-links';
  props: {
    links: Array<{
      platform: string;
      url: string;
    }>;
    style: 'icons' | 'buttons' | 'minimal';
    size: 'small' | 'medium' | 'large';
  };
}

export interface VideoComponent extends PageComponentBase {
  type: 'video';
  props: {
    url: string;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    aspectRatio: '16:9' | '4:3' | '1:1';
  };
}

export interface CountdownComponent extends PageComponentBase {
  type: 'countdown';
  props: {
    targetDate: string;
    title?: string;
    style: 'simple' | 'flip' | 'circular';
  };
}

export interface PricingComponent extends PageComponentBase {
  type: 'pricing';
  props: {
    title: string;
    price: string;
    period?: string;
    features: string[];
    ctaText: string;
    ctaUrl: string;
    highlighted: boolean;
  };
}

export interface FAQComponent extends PageComponentBase {
  type: 'faq';
  props: {
    items: Array<{
      question: string;
      answer: string;
    }>;
    style: 'accordion' | 'list';
  };
}

export interface ContactFormComponent extends PageComponentBase {
  type: 'contact-form';
  props: {
    title?: string;
    fields: Array<{
      name: string;
      type: 'text' | 'email' | 'textarea';
      required: boolean;
    }>;
    submitText: string;
  };
}

export interface NewsletterComponent extends PageComponentBase {
  type: 'newsletter';
  props: {
    title: string;
    description?: string;
    placeholder: string;
    buttonText: string;
    style: 'inline' | 'stacked';
  };
}

export type PageComponent =
  | HeroComponent
  | HeadingComponent
  | TextComponent
  | ButtonComponent
  | CardComponent
  | ImageComponent
  | DividerComponent
  | SpacerComponent
  | IconListComponent
  | CTAComponent
  | TestimonialComponent
  | StatsComponent
  | FeatureGridComponent
  | SocialLinksComponent
  | VideoComponent
  | CountdownComponent
  | PricingComponent
  | FAQComponent
  | ContactFormComponent
  | NewsletterComponent;

// Component category for organizing the library
export interface ComponentCategory {
  id: string;
  name: string;
  icon: string;
  components: ComponentPreset[];
}

// Preset definition for the library
export interface ComponentPreset {
  type: PageComponentType;
  name: string;
  description: string;
  icon: string;
  defaultProps: Omit<PageComponent, 'id' | 'order' | 'visible'>['props'];
}
