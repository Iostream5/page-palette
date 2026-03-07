// Page Component Renderer - Renders individual components
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_PRESET_LIST } from './AnimationSelector';
import { PageComponent } from '@/types/page-components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ComponentRendererProps {
  component: PageComponent;
  isEditing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function ComponentRenderer({ 
  component, 
  isEditing = false,
  onSelect,
  isSelected = false,
  deviceMode = 'desktop'
}: ComponentRendererProps & { deviceMode?: 'desktop' | 'tablet' | 'mobile' }) {
  const props = component.props as any;

  const wrapperClasses = cn(
    'relative transition-all',
    isEditing && 'cursor-pointer',
    isEditing && isSelected && 'ring-2 ring-primary ring-offset-2',
    isEditing && !isSelected && 'hover:ring-1 hover:ring-muted-foreground/30',
    props.boxShadow === 'sm' && 'shadow-sm',
    props.boxShadow === 'md' && 'shadow-md',
    props.boxShadow === 'lg' && 'shadow-lg',
    props.boxShadow === 'xl' && 'shadow-xl'
  );

  // Apply responsive overrides
  const getResponsiveProp = (baseKey: string) => {
    if (deviceMode === 'desktop') return props[baseKey];
    return props[`${baseKey}_${deviceMode}`] || props[baseKey];
  };

  const advancedStyles = {
    padding: getResponsiveProp('padding'),
    margin: getResponsiveProp('margin'),
    zIndex: props.zIndex,
    opacity: props.opacity !== undefined ? props.opacity / 100 : undefined,
  };

  // Get animation config
  const componentAnimations = component.animations || [];
  const entranceAnim = ANIMATION_PRESET_LIST.find(a => componentAnimations.includes(a.id) && a.category === 'entrance');
  const hoverAnim = ANIMATION_PRESET_LIST.find(a => componentAnimations.includes(a.id) && a.category === 'hover');
  const loopAnim = ANIMATION_PRESET_LIST.find(a => componentAnimations.includes(a.id) && a.category === 'continuous');

  const animationProps = {
    initial: entranceAnim?.gsapConfig?.from || { opacity: 1 },
    whileInView: entranceAnim?.gsapConfig?.to || { opacity: 1 },
    viewport: { once: true, amount: 0.2 },
    whileHover: hoverAnim?.id === 'hover-scale' ? { scale: 1.05 } :
                hoverAnim?.id === 'hover-lift' ? { y: -10 } : undefined,
    animate: loopAnim?.id === 'pulse' ? { scale: [1, 1.05, 1] } :
             loopAnim?.id === 'float' ? { y: [0, -10, 0] } : undefined,
    transition: {
      duration: entranceAnim?.gsapConfig?.duration || 0.5,
      ease: "easeOut",
      ...(loopAnim ? { repeat: Infinity, duration: 2 } : {})
    }
  };

  return (
    <motion.div 
      id={component.id}
      className={cn(wrapperClasses, loopAnim?.cssClass, (component as any).className)}
      style={advancedStyles}
      onClick={onSelect}
      {...animationProps}
      layout
    >
      {renderComponent(component)}
    </motion.div>
  );
}

function renderComponent(component: PageComponent) {
  switch (component.type) {
    case 'hero':
      return <HeroRenderer {...component.props} />;
    case 'heading':
      return <HeadingRenderer {...component.props} />;
    case 'text':
      return <TextRenderer {...component.props} />;
    case 'button':
      return <ButtonRenderer {...component.props} />;
    case 'card':
      return <CardRenderer {...component.props} />;
    case 'image':
      return <ImageRenderer {...component.props} />;
    case 'divider':
      return <DividerRenderer {...component.props} />;
    case 'spacer':
      return <SpacerRenderer {...component.props} />;
    case 'cta':
      return <CTARenderer {...component.props} />;
    case 'testimonial':
      return <TestimonialRenderer {...component.props} />;
    case 'stats':
      return <StatsRenderer {...component.props} />;
    case 'feature-grid':
      return <FeatureGridRenderer {...component.props} />;
    case 'social-links':
      return <SocialLinksRenderer {...component.props} />;
    case 'icon-list':
      return <IconListRenderer {...component.props} />;
    case 'newsletter':
      return <NewsletterRenderer {...component.props} />;
    case 'pricing':
      return <PricingRenderer {...component.props} />;
    case 'faq':
      return <FAQRenderer {...component.props} />;
    case 'countdown':
      return <CountdownRenderer {...component.props} />;
    case 'contact-form':
      return <ContactFormRenderer {...component.props} />;
    case 'video':
      return <VideoRenderer {...component.props} />;
    case 'tabs':
      return <TabsRenderer {...component.props} />;
    case 'carousel':
      return <CarouselRenderer {...component.props} />;
    case 'logo-cloud':
      return <LogoCloudRenderer {...component.props} />;
    case 'timeline':
      return <TimelineRenderer {...component.props} />;
    case 'accordion':
      return <AccordionRenderer {...component.props} />;
    case 'alert':
      return <AlertRenderer {...component.props} />;
    default:
      return <div className="p-4 text-muted-foreground">Unknown component</div>;
  }
}

// ============= Individual Renderers =============

function HeroRenderer(props: { 
  title: string; 
  subtitle: string; 
  backgroundGradient?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaUrl?: string;
  alignment: string;
  height: string;
}) {
  const heightClasses = {
    small: 'min-h-[200px]',
    medium: 'min-h-[300px]',
    large: 'min-h-[400px]',
    full: 'min-h-[500px]',
  };

  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div 
      className={cn(
        'relative flex flex-col justify-center p-8 rounded-xl overflow-hidden',
        heightClasses[props.height as keyof typeof heightClasses],
        alignClasses[props.alignment as keyof typeof alignClasses]
      )}
      style={{ 
        background: props.backgroundImage 
          ? `url(${props.backgroundImage}) center/cover` 
          : props.backgroundGradient 
      }}
    >
      <div className="relative z-10">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {props.title}
        </motion.h1>
        <motion.p 
          className="text-lg text-white/90 mb-6 max-w-xl drop-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {props.subtitle}
        </motion.p>
        {props.ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg" className="shadow-lg">
              {props.ctaText}
            </Button>
          </motion.div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}

function AccordionRenderer(props: {
  items: Array<{ title: string; content: string }>;
  variant: string;
}) {
  return (
    <Accordion type="single" collapsible className="w-full py-4">
      {props.items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className={cn(
            props.variant === 'separated' && "border rounded-lg mb-2 px-4",
            props.variant === 'ghost' && "border-none"
          )}
        >
          <AccordionTrigger className="hover:no-underline font-semibold">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function AlertRenderer(props: {
  title: string;
  description: string;
  variant: string;
  showIcon: boolean;
}) {
  const IconMap = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    destructive: AlertCircle,
    default: Info,
  };

  const Icon = IconMap[props.variant as keyof typeof IconMap] || IconMap.default;

  return (
    <Alert variant={props.variant === 'destructive' ? 'destructive' : 'default'} className={cn(
      "py-4",
      props.variant === 'info' && "bg-blue-50 border-blue-200 text-blue-800",
      props.variant === 'success' && "bg-green-50 border-green-200 text-green-800",
      props.variant === 'warning' && "bg-yellow-50 border-yellow-200 text-yellow-800",
    )}>
      {props.showIcon && <Icon className="h-4 w-4" />}
      <AlertTitle className="font-bold">{props.title}</AlertTitle>
      <AlertDescription>{props.description}</AlertDescription>
    </Alert>
  );
}

function HeadingRenderer(props: { text: string; level: string; alignment: string; color?: string }) {
  const Tag = props.level as 'h1' | 'h2' | 'h3' | 'h4';
  const sizeClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-medium',
  };

  return (
    <Tag 
      className={cn(
        sizeClasses[Tag],
        `text-${props.alignment}`,
        'text-foreground py-2'
      )}
      style={{ color: props.color }}
    >
      {props.text}
    </Tag>
  );
}

function TextRenderer(props: { content: string; alignment: string; fontSize: string }) {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <p className={cn(
      sizeClasses[props.fontSize as keyof typeof sizeClasses],
      `text-${props.alignment}`,
      'text-muted-foreground leading-relaxed py-2'
    )}>
      {props.content}
    </p>
  );
}

function ButtonRenderer(props: { 
  text: string; 
  url: string; 
  variant: string; 
  size: string; 
  fullWidth: boolean 
}) {
  const sizeMap = {
    small: 'sm' as const,
    medium: 'default' as const,
    large: 'lg' as const,
  };

  return (
    <div className={cn('py-2', props.fullWidth && 'w-full')}>
      <Button
        variant={props.variant as 'default' | 'secondary' | 'outline' | 'ghost'}
        size={sizeMap[props.size as keyof typeof sizeMap]}
        className={cn(props.fullWidth && 'w-full')}
        asChild
      >
        <a href={props.url}>{props.text}</a>
      </Button>
    </div>
  );
}

function CardRenderer(props: {
  title: string;
  description: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  variant: string;
}) {
  const variantClasses = {
    default: '',
    elevated: 'shadow-lg',
    bordered: 'border-2',
    glass: 'backdrop-blur-lg bg-white/10 border-white/20',
  };

  return (
    <Card className={cn('overflow-hidden', variantClasses[props.variant as keyof typeof variantClasses])}>
      {props.image && (
        <div className="aspect-video overflow-hidden">
          <img src={props.image} alt={props.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      {props.ctaText && (
        <CardContent>
          <Button variant="outline" asChild>
            <a href={props.ctaUrl}>{props.ctaText}</a>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

function ImageRenderer(props: {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio: string;
  rounded: boolean;
  shadow: boolean;
}) {
  const aspectClasses = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    'auto': '',
  };

  return (
    <figure className="py-2">
      <div className={cn(
        'overflow-hidden',
        aspectClasses[props.aspectRatio as keyof typeof aspectClasses],
        props.rounded && 'rounded-xl',
        props.shadow && 'shadow-lg'
      )}>
        <img src={props.src} alt={props.alt} className="w-full h-full object-cover" />
      </div>
      {props.caption && (
        <figcaption className="text-sm text-muted-foreground text-center mt-2">
          {props.caption}
        </figcaption>
      )}
    </figure>
  );
}

function DividerRenderer(props: { style: string; thickness: string; color?: string }) {
  const thicknessClasses = {
    thin: 'border-t',
    medium: 'border-t-2',
    thick: 'border-t-4',
  };

  const styleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    gradient: 'border-0 h-1 bg-gradient-to-r from-transparent via-border to-transparent',
  };

  return (
    <hr 
      className={cn(
        'my-4',
        thicknessClasses[props.thickness as keyof typeof thicknessClasses],
        styleClasses[props.style as keyof typeof styleClasses],
        'border-border'
      )}
      style={{ borderColor: props.color }}
    />
  );
}

function SpacerRenderer(props: { height: string }) {
  const heightClasses = {
    small: 'h-4',
    medium: 'h-8',
    large: 'h-16',
    xlarge: 'h-24',
  };

  return <div className={heightClasses[props.height as keyof typeof heightClasses]} />;
}

function CTARenderer(props: {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  variant: string;
}) {
  const variantStyles = {
    simple: 'py-8',
    boxed: 'py-8 px-6 rounded-xl border border-border bg-card',
    gradient: 'py-8 px-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20',
  };

  return (
    <div className={cn('text-center', variantStyles[props.variant as keyof typeof variantStyles])}>
      <h3 className="text-2xl font-bold text-foreground mb-2">{props.title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{props.description}</p>
      <Button size="lg" asChild>
        <a href={props.buttonUrl}>{props.buttonText}</a>
      </Button>
    </div>
  );
}

function TestimonialRenderer(props: {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}) {
  return (
    <Card className="p-6">
      {props.rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < props.rating! ? 'text-yellow-500' : 'text-muted'}>
              ★
            </span>
          ))}
        </div>
      )}
      <blockquote className="text-lg italic text-foreground mb-4">
        "{props.quote}"
      </blockquote>
      <div className="flex items-center gap-3">
        {props.avatar && (
          <img src={props.avatar} alt={props.author} className="w-10 h-10 rounded-full object-cover" />
        )}
        <div>
          <p className="font-medium text-foreground">{props.author}</p>
          {props.role && <p className="text-sm text-muted-foreground">{props.role}</p>}
        </div>
      </div>
    </Card>
  );
}

function StatsRenderer(props: {
  items: Array<{ value: string; label: string; icon?: string }>;
  layout: string;
}) {
  return (
    <div className={cn(
      'grid gap-6 py-6',
      props.layout === 'row' ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'
    )}>
      {props.items.map((item, i) => (
        <div key={i} className="text-center">
          {item.icon && <span className="text-2xl mb-2 block">{item.icon}</span>}
          <p className="text-3xl font-bold text-foreground">{item.value}</p>
          <p className="text-sm text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function FeatureGridRenderer(props: {
  columns: number;
  items: Array<{ icon: string; title: string; description: string }>;
}) {
  return (
    <div className={cn('grid gap-6 py-4', `grid-cols-${props.columns}`)}>
      {props.items.map((item, i) => (
        <div key={i} className="text-center p-4">
          <span className="text-3xl mb-3 block">{item.icon}</span>
          <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function SocialLinksRenderer(props: {
  links: Array<{ platform: string; url: string }>;
  style: string;
  size: string;
}) {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl',
  };

  const platformIcons: Record<string, string> = {
    twitter: '𝕏',
    instagram: '📷',
    linkedin: '💼',
    facebook: '📘',
    youtube: '▶️',
    tiktok: '🎵',
    github: '💻',
  };

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {props.links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          className={cn(
            sizeClasses[props.size as keyof typeof sizeClasses],
            'hover:opacity-80 transition-opacity',
            props.style === 'buttons' && 'p-3 rounded-full bg-muted'
          )}
        >
          {platformIcons[link.platform] || '🔗'}
        </a>
      ))}
    </div>
  );
}

function IconListRenderer(props: {
  items: Array<{ icon: string; text: string }>;
  layout: string;
  iconColor?: string;
}) {
  return (
    <ul className={cn(
      'py-2',
      props.layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'
    )}>
      {props.items.map((item, i) => (
        <li key={i} className="flex items-center gap-2">
          <span style={{ color: props.iconColor }}>{item.icon}</span>
          <span className="text-foreground">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function NewsletterRenderer(props: {
  title: string;
  description?: string;
  placeholder: string;
  buttonText: string;
  style: string;
}) {
  return (
    <div className="py-6 text-center">
      <h3 className="text-xl font-semibold text-foreground mb-2">{props.title}</h3>
      {props.description && (
        <p className="text-muted-foreground mb-4">{props.description}</p>
      )}
      <div className={cn(
        'max-w-md mx-auto',
        props.style === 'inline' ? 'flex gap-2' : 'space-y-3'
      )}>
        <Input placeholder={props.placeholder} className="flex-1" />
        <Button>{props.buttonText}</Button>
      </div>
    </div>
  );
}

function PricingRenderer(props: {
  title: string;
  price: string;
  period?: string;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  highlighted: boolean;
}) {
  return (
    <Card className={cn(
      'p-6 text-center',
      props.highlighted && 'border-primary shadow-lg scale-105'
    )}>
      <h3 className="text-xl font-semibold mb-2">{props.title}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{props.price}</span>
        {props.period && <span className="text-muted-foreground">{props.period}</span>}
      </div>
      <ul className="space-y-2 mb-6 text-left">
        {props.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={props.highlighted ? 'default' : 'outline'} asChild>
        <a href={props.ctaUrl}>{props.ctaText}</a>
      </Button>
    </Card>
  );
}

function FAQRenderer(props: {
  items: Array<{ question: string; answer: string }>;
  style: string;
}) {
  if (props.style === 'accordion') {
    return (
      <Accordion type="single" collapsible className="w-full">
        {props.items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  return (
    <div className="space-y-4">
      {props.items.map((item, i) => (
        <div key={i}>
          <h4 className="font-semibold text-foreground mb-1">{item.question}</h4>
          <p className="text-muted-foreground">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}

function CountdownRenderer(props: {
  targetDate: string;
  title?: string;
  style: string;
}) {
  // Simple static display - in real use, would need useEffect for live countdown
  const target = new Date(props.targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="py-6 text-center">
      {props.title && <h3 className="text-xl font-semibold mb-4">{props.title}</h3>}
      <div className="flex justify-center gap-4">
        {[
          { value: days, label: 'Days' },
          { value: hours, label: 'Hours' },
          { value: minutes, label: 'Minutes' },
        ].map((item, i) => (
          <div key={i} className={cn(
            'p-4 rounded-lg bg-muted min-w-[80px]',
            props.style === 'flip' && 'shadow-lg'
          )}>
            <p className="text-3xl font-bold">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactFormRenderer(props: {
  title?: string;
  fields: Array<{ name: string; type: string; required: boolean }>;
  submitText: string;
}) {
  return (
    <Card className="p-6">
      {props.title && <h3 className="text-xl font-semibold mb-4">{props.title}</h3>}
      <form className="space-y-4">
        {props.fields.map((field, i) => (
          <div key={i}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <Textarea placeholder={`Enter ${field.name}`} />
            ) : (
              <Input type={field.type} placeholder={`Enter ${field.name}`} />
            )}
          </div>
        ))}
        <Button type="submit" className="w-full">{props.submitText}</Button>
      </form>
    </Card>
  );
}

function VideoRenderer(props: {
  url: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  aspectRatio: string;
}) {
  const aspectClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  };

  return (
    <div className={cn(
      'overflow-hidden rounded-xl',
      aspectClasses[props.aspectRatio as keyof typeof aspectClasses]
    )}>
      <iframe
        src={`${props.url}?autoplay=${props.autoplay ? 1 : 0}&mute=${props.muted ? 1 : 0}&loop=${props.loop ? 1 : 0}`}
        className="w-full h-full"
        allowFullScreen
      />
    </div>
  );
}

function TabsRenderer(props: {
  items: Array<{ label: string; content: string }>;
  variant: string;
}) {
  return (
    <Tabs defaultValue={props.items[0]?.label} className="w-full py-4">
      <TabsList className={cn(
        "w-full justify-start",
        props.variant === 'pills' && "bg-transparent gap-2",
        props.variant === 'outline' && "border border-input bg-transparent"
      )}>
        {props.items.map((item, i) => (
          <TabsTrigger
            key={i}
            value={item.label}
            className={cn(
              props.variant === 'pills' && "rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
            )}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {props.items.map((item, i) => (
        <TabsContent key={i} value={item.label} className="mt-4 p-4 border rounded-lg bg-card min-h-[100px]">
          <p className="text-muted-foreground whitespace-pre-wrap">{item.content}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function CarouselRenderer(props: {
  slides: Array<{ image: string; title?: string; description?: string }>;
  autoplay: boolean;
  showArrows: boolean;
  showDots: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);

    let interval: any;
    if (props.autoplay) {
      interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 4000);
    }

    return () => {
      emblaApi.off('select', onSelect);
      if (interval) clearInterval(interval);
    };
  }, [emblaApi, onSelect, props.autoplay]);

  return (
    <div className="relative py-4 group">
      <div className="overflow-hidden rounded-xl bg-muted shadow-lg" ref={emblaRef}>
        <div className="flex">
          {props.slides.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 relative aspect-video">
              <img src={slide.image} alt="" className="w-full h-full object-cover" />
              {(slide.title || slide.description) && (
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  {slide.title && <h4 className="text-xl font-bold mb-1">{slide.title}</h4>}
                  {slide.description && <p className="text-sm text-white/80">{slide.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {props.showArrows && props.slides.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {props.showDots && props.slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {props.slides.map((_, i) => (
            <button
              key={i}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                selectedIndex === i ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              onClick={() => emblaApi && emblaApi.scrollTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LogoCloudRenderer(props: {
  logos: Array<{ src: string; alt: string; url?: string }>;
  title?: string;
  layout: string;
}) {
  return (
    <div className="py-12">
      {props.title && <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-10">{props.title}</p>}

      {props.layout === 'marquee' ? (
        <div className="flex overflow-hidden group">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] gap-12 items-center">
            {[...props.logos, ...props.logos].map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-8 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center">
          {props.logos.map((logo, i) => (
            <div key={i} className="flex justify-center">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-8 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineRenderer(props: {
  items: Array<{ date: string; title: string; description: string }>;
  layout: string;
}) {
  return (
    <div className="py-8">
      <div className="relative border-l border-primary/20 ml-3 md:ml-0 md:left-1/2">
        {props.items.map((item, i) => {
          const isLeft = props.layout === 'left' || (props.layout === 'alternate' && i % 2 === 0);

          return (
            <div key={i} className={cn(
              "relative mb-8 md:w-1/2",
              isLeft ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
            )}>
              <div className={cn(
                "absolute top-0 -left-[1.35rem] md:left-auto h-10 w-10 rounded-full border-4 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground",
                isLeft ? "md:-right-[1.25rem]" : "md:-left-[1.25rem]"
              )}>
                {item.date}
              </div>
              <div className="p-5 rounded-xl bg-card border shadow-sm">
                <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
