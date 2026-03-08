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
  | 'newsletter'
  | 'product-item'
  | 'marquee'
  | 'bento-grid'
  | 'process-steps'
  | 'logo-cloud'
  // Primitive Components
  | 'box'
  | 'flex'
  | 'grid'
  | 'image-basic'
  | 'button-basic'
  // New Layout Components
  | 'layout-section'
  | 'layout-container'
  | 'layout-stack'
  | 'layout-grid'
  | 'layout-columns'
  // New Content Components
  | 'content-paragraph'
  | 'content-badge'
  | 'content-avatar'
  // New UI Components
  | 'ui-tabs'
  | 'ui-carousel'
  | 'ui-breadcrumb'
  // New Form Components
  | 'form-input'
  | 'form-checkbox'
  | 'form-switch'
  | 'form-slider';

export interface PageComponentBase {
  id: string;
  type: PageComponentType;
  order: number;
  visible: boolean;
  customName?: string;
  locked?: boolean;
  animations?: string[];
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

export interface ProductItemComponent extends PageComponentBase {
  type: 'product-item';
  props: {
    title: string;
    productNo: string;
    productUrl: string;
    price: string;
    description?: string;
    image?: string;
    buttonText: string;
    badge?: string;
  };
}

export interface MarqueeComponent extends PageComponentBase {
  type: 'marquee';
  props: {
    items: string[];
    speed: number;
    direction: 'left' | 'right';
    pauseOnHover: boolean;
    gap: string;
  };
}

export interface BentoGridComponent extends PageComponentBase {
  type: 'bento-grid';
  props: {
    items: Array<{
      title: string;
      description: string;
      image?: string;
      size: 'small' | 'medium' | 'large';
      color?: string;
    }>;
  };
}

export interface ProcessStepsComponent extends PageComponentBase {
  type: 'process-steps';
  props: {
    steps: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    layout: 'vertical' | 'horizontal';
    color?: string;
  };
}

export interface LogoCloudComponent extends PageComponentBase {
  type: 'logo-cloud';
  props: {
    logos: Array<{
      src: string;
      alt: string;
      url?: string;
    }>;
    title?: string;
    style: 'grid' | 'marquee' | 'simple';
  };
}

// Primitive Components
export interface PrimitiveStyleProps {
  margin?: string;
  padding?: string;
  gap?: string;
  width?: string;
  height?: string;
  background?: string;
  border?: string;
  // Responsive overrides
  margin_tablet?: string;
  margin_mobile?: string;
  padding_tablet?: string;
  padding_mobile?: string;
  gap_tablet?: string;
  gap_mobile?: string;
  width_tablet?: string;
  width_mobile?: string;
  height_tablet?: string;
  height_mobile?: string;
}

export interface BoxComponent extends PageComponentBase {
  type: 'box';
  props: PrimitiveStyleProps & {
    children?: string[];
  };
}

export interface FlexComponent extends PageComponentBase {
  type: 'flex';
  props: PrimitiveStyleProps & {
    direction?: 'row' | 'column';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    children?: string[];
  };
}

export interface GridComponent extends PageComponentBase {
  type: 'grid';
  props: PrimitiveStyleProps & {
    columns?: string;
    rows?: string;
    children?: string[];
  };
}

export interface PrimitiveTextComponent extends PageComponentBase {
  type: 'text';
  props: PrimitiveStyleProps & {
    content: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: string;
    children?: string[];
  };
}

export interface ImageBasicComponent extends PageComponentBase {
  type: 'image-basic';
  props: PrimitiveStyleProps & {
    src: string;
    alt?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    children?: string[];
  };
}

export interface ButtonBasicComponent extends PageComponentBase {
  type: 'button-basic';
  props: PrimitiveStyleProps & {
    text: string;
    url?: string;
    children?: string[];
  };
}

// Layout Components
export interface LayoutSectionComponent extends PageComponentBase {
  type: 'layout-section';
  props: PrimitiveStyleProps & {
    backgroundColor?: string;
    backgroundImage?: string;
    fullWidth?: boolean;
    children?: string[];
  };
}

export interface LayoutContainerComponent extends PageComponentBase {
  type: 'layout-container';
  props: PrimitiveStyleProps & {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    children?: string[];
  };
}

export interface LayoutStackComponent extends PageComponentBase {
  type: 'layout-stack';
  props: PrimitiveStyleProps & {
    direction?: 'vertical' | 'horizontal';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between';
    children?: string[];
  };
}

export interface LayoutGridComponent extends PageComponentBase {
  type: 'layout-grid';
  props: PrimitiveStyleProps & {
    columns?: string;
    rows?: string;
    children?: string[];
  };
}

export interface LayoutColumnsComponent extends PageComponentBase {
  type: 'layout-columns';
  props: PrimitiveStyleProps & {
    count?: number;
    children?: string[];
  };
}

// Content Components
export interface ContentParagraphComponent extends PageComponentBase {
  type: 'content-paragraph';
  props: {
    text: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    fontSize: string;
    lineHeight: string;
  };
}

export interface ContentBadgeComponent extends PageComponentBase {
  type: 'content-badge';
  props: {
    text: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    size: 'sm' | 'md' | 'lg';
  };
}

export interface ContentAvatarComponent extends PageComponentBase {
  type: 'content-avatar';
  props: {
    src?: string;
    fallback: string;
    size: 'sm' | 'md' | 'lg' | 'xl';
    shape: 'circle' | 'square';
  };
}

// UI Components
export interface UITabsComponent extends PageComponentBase {
  type: 'ui-tabs';
  props: {
    items: Array<{
      label: string;
      content: string;
    }>;
    variant: 'default' | 'outline';
  };
}

export interface UICarouselComponent extends PageComponentBase {
  type: 'ui-carousel';
  props: {
    images: string[];
    aspectRatio: string;
    autoplay: boolean;
    showArrows: boolean;
    showDots: boolean;
  };
}

export interface UIBreadcrumbComponent extends PageComponentBase {
  type: 'ui-breadcrumb';
  props: {
    items: Array<{
      label: string;
      url: string;
    }>;
  };
}

// Form Components
export interface FormInputComponent extends PageComponentBase {
  type: 'form-input';
  props: {
    label: string;
    placeholder: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel';
    required: boolean;
    helpText?: string;
  };
}

export interface FormCheckboxComponent extends PageComponentBase {
  type: 'form-checkbox';
  props: {
    label: string;
    checked: boolean;
    required: boolean;
  };
}

export interface FormSwitchComponent extends PageComponentBase {
  type: 'form-switch';
  props: {
    label: string;
    checked: boolean;
  };
}

export interface FormSliderComponent extends PageComponentBase {
  type: 'form-slider';
  props: {
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
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
  | NewsletterComponent
  | ProductItemComponent
  | MarqueeComponent
  | BentoGridComponent
  | ProcessStepsComponent
  | LogoCloudComponent
  | LayoutSectionComponent
  | LayoutContainerComponent
  | LayoutStackComponent
  | LayoutGridComponent
  | LayoutColumnsComponent
  | ContentParagraphComponent
  | ContentBadgeComponent
  | ContentAvatarComponent
  | UITabsComponent
  | UICarouselComponent
  | UIBreadcrumbComponent
  | FormInputComponent
  | FormCheckboxComponent
  | FormSwitchComponent
  | FormSliderComponent
  | BoxComponent
  | FlexComponent
  | GridComponent
  | PrimitiveTextComponent
  | ImageBasicComponent
  | ButtonBasicComponent;

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
