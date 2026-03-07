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
  const entranceAnim = ANIMATION_PRESET_LIST.find(a => componentAnimations.includes(a.id) && a.type === 'entrance');
  const hoverAnim = ANIMATION_PRESET_LIST.find(a => componentAnimations.includes(a.id) && a.type === 'hover');
  const loopAnim = ANIMATION_PRESET_LIST.find(a => componentAnimations.includes(a.id) && a.type === 'loop');

  const animationProps = {
    initial: entranceAnim ? { opacity: 0, y: 20 } : { opacity: 1 },
    whileInView: entranceAnim ? { opacity: 1, y: 0 } : { opacity: 1 },
    viewport: { once: true, amount: 0.2 },
    whileHover: hoverAnim?.id === 'hover-scale' ? { scale: 1.05 } :
                hoverAnim?.id === 'hover-lift' ? { y: -10 } :
                hoverAnim?.id === 'hover-glow' ? { boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.5)" } : undefined,
    animate: loopAnim?.id === 'pulse' ? { scale: [1, 1.02, 1] } :
             loopAnim?.id === 'float' ? { y: [0, -10, 0] } :
             loopAnim?.id === 'spin' ? { rotate: 360 } : undefined,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      ...(loopAnim ? { repeat: Infinity, duration: loopAnim.id === 'spin' ? 10 : 3, ease: "linear" } : {})
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
    case 'product-item':
      return <ProductItemRenderer {...component.props} />;
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
  variant?: 'default' | 'glass' | 'bold';
}) {
  const heightClasses = {
    small: 'min-h-[260px] py-12',
    medium: 'min-h-[400px] py-20',
    large: 'min-h-[600px] py-32',
    full: 'min-h-[80vh] py-40',
  };

  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const isGlass = props.variant === 'glass';

  return (
    <div 
      className={cn(
        'relative flex flex-col justify-center px-6 md:px-12 rounded-3xl overflow-hidden transition-all duration-500 group/hero',
        heightClasses[props.height as keyof typeof heightClasses],
        alignClasses[props.alignment as keyof typeof alignClasses],
        isGlass && 'border border-white/20 backdrop-blur-md'
      )}
      style={{ 
        background: props.backgroundImage 
          ? `url(${props.backgroundImage}) center/cover no-repeat`
          : props.backgroundGradient || 'var(--primary)'
      }}
    >
      {/* Background Overlay */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        props.backgroundImage ? "bg-black/40 group-hover/hero:bg-black/30" : "bg-black/5"
      )} />

      {/* Interactive Light Effect */}
      <div className="absolute inset-0 opacity-0 group-hover/hero:opacity-20 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.4)_0%,transparent_60%)] pointer-events-none transition-opacity duration-300" />

      <div className="relative z-10 w-full max-w-4xl space-y-6">
        <motion.h1 
          className={cn(
            "font-bold tracking-tight text-white drop-shadow-xl",
            props.height === 'small' ? 'text-3xl md:text-4xl' : 'text-4xl md:text-6xl lg:text-7xl'
          )}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {props.title}
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {props.subtitle}
        </motion.p>

        {props.ctaText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="pt-4"
          >
            <Button
              size="lg"
              className="h-14 px-8 rounded-full text-lg font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all active:scale-95 bg-white text-black hover:bg-white/90"
            >
              {props.ctaText}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
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
    default: 'bg-card border-border shadow-sm',
    elevated: 'bg-card border-none shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]',
    bordered: 'bg-transparent border-2 border-border hover:border-primary/50',
    glass: 'backdrop-blur-xl bg-white/10 border-white/20 shadow-none',
  };

  return (
    <Card
      className={cn(
        'overflow-hidden rounded-3xl transition-all duration-300 group/card border',
        variantClasses[props.variant as keyof typeof variantClasses],
        'hover:-translate-y-2'
      )}
    >
      {props.image && (
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={props.image}
            alt={props.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
          />
        </div>
      )}
      <CardHeader className="space-y-3 p-6">
        <CardTitle className="text-xl font-bold tracking-tight">{props.title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {props.description}
        </CardDescription>
      </CardHeader>
      {props.ctaText && (
        <CardContent className="p-6 pt-0">
          <Button
            variant="ghost"
            className="group/btn p-0 h-auto hover:bg-transparent text-primary font-semibold flex items-center gap-2"
            asChild
          >
            <a href={props.ctaUrl}>
              {props.ctaText}
              <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
            </a>
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
    <Card className="p-8 md:p-10 rounded-[2.5rem] bg-card border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group/testimonial">
      {/* Decorative Quote Mark */}
      <div className="absolute top-0 right-0 text-primary/5 -translate-y-4 translate-x-4">
        <svg width="160" height="160" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017C11.4647 13 11.017 12.5523 11.017 12V9C11.017 6.23858 13.2556 4 16.017 4H19.017C21.7784 4 24.017 6.23858 24.017 9V15C24.017 18.3137 21.3307 21 18.017 21H14.017ZM0.0170898 21L0.0170898 18C0.0170898 16.8954 0.912521 16 2.01709 16H5.01709C5.56937 16 6.01709 15.5523 6.01709 15V9C6.01709 8.44772 5.56937 8 5.01709 8H2.01709C1.46481 8 1.01709 8.44772 1.01709 9V12C1.01709 12.5523 0.569375 13 0.0170898 13H-1.98291C-2.5352 13 -2.98291 12.5523 -2.98291 12V9C-2.98291 6.23858 -0.744335 4 2.01709 4H5.01709C7.77851 4 10.0171 6.23858 10.0171 9V15C10.0171 18.3137 7.33079 21 4.01709 21H0.0170898Z" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        {props.rating && (
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={cn(
                "text-lg",
                i < props.rating! ? 'text-amber-400' : 'text-muted-foreground/20'
              )}>
                ★
              </span>
            ))}
          </div>
        )}

        <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed italic">
          "{props.quote}"
        </blockquote>

        <div className="flex flex-col items-center space-y-4 pt-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-110 blur-sm opacity-0 group-hover/testimonial:opacity-100 transition-opacity duration-500" />
            {props.avatar ? (
              <img
                src={props.avatar}
                alt={props.author}
                className="w-16 h-16 rounded-full object-cover border-2 border-background relative z-10"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl relative z-10">
                {props.author.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-foreground tracking-tight">{props.author}</p>
            {props.role && <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{props.role}</p>}
          </div>
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
    <Card
      className={cn(
        'p-8 text-center rounded-3xl transition-all duration-300 border relative overflow-hidden',
        props.highlighted
          ? 'border-primary ring-2 ring-primary/20 shadow-2xl scale-105 z-10 bg-card'
          : 'border-border shadow-sm bg-card hover:border-primary/30'
      )}
    >
      {props.highlighted && (
        <div className="absolute top-0 right-0 p-2">
          <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-lg">
            Popular
          </span>
        </div>
      )}

      <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground mb-6">{props.title}</h3>
      <div className="mb-8">
        <span className="text-5xl font-black tracking-tighter">{props.price}</span>
        {props.period && <span className="text-muted-foreground font-medium ml-1">{props.period}</span>}
      </div>

      <ul className="space-y-4 mb-10 text-left">
        {props.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary text-xs font-bold">✓</span>
            </div>
            <span className="text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={props.highlighted ? "default" : "outline"}
        className={cn(
          "w-full h-12 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg",
          props.highlighted
            ? "shadow-primary/25"
            : "border-primary/20 hover:bg-primary/5 text-primary"
        )}
        asChild
      >
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

function ProductItemRenderer(props: {
  title: string;
  productNo: string;
  productUrl: string;
  price: string;
  description?: string;
  image?: string;
  buttonText: string;
  badge?: string;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-md group/product">
      <div className="flex flex-col sm:flex-row h-full">
        {props.image && (
          <div className="w-full sm:w-48 h-48 shrink-0 overflow-hidden relative">
            <img
              src={props.image}
              alt={props.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/product:scale-110"
            />
            {props.badge && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {props.badge}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase tracking-tighter shrink-0">
                #{props.productNo}
              </span>
              <h3 className="font-bold text-lg leading-tight truncate text-foreground tracking-tight">
                {props.title}
              </h3>
            </div>

            {props.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {props.description}
              </p>
            )}

            <div className="text-xl font-black text-primary tracking-tighter">
              {props.price}
            </div>
          </div>

          <Button
            className="mt-4 w-full rounded-xl font-bold transition-all active:scale-95 group/shopee"
            asChild
          >
            <a href={props.productUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <span>{props.buttonText}</span>
              <span className="transition-transform group-hover/shopee:translate-x-1">→</span>
            </a>
          </Button>
        </div>
      </div>
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
