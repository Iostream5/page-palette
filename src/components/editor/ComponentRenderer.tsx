// Page Component Renderer - Renders individual components
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_PRESET_LIST } from './AnimationSelector';
import { PageComponent } from '@/types/page-components';
import * as Primitive from './Primitives';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport } from '@/components/ui/toast';

interface ComponentRendererProps {
  component: PageComponent;
  allComponents?: PageComponent[];
  isEditing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function ComponentRenderer({ 
  component, 
  allComponents = [],
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
    gap: getResponsiveProp('gap'),
    width: getResponsiveProp('width'),
    height: getResponsiveProp('height'),
    background: props.background,
    border: props.border,
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
      {renderComponent(component, { allComponents, isEditing, deviceMode })}
    </motion.div>
  );
}

function renderComponent(
  component: PageComponent,
  context: { allComponents: PageComponent[], isEditing: boolean, deviceMode: any }
) {
  const { allComponents, isEditing, deviceMode } = context;

  switch (component.type) {
    case 'product-item':
      return <ProductItemRenderer {...component.props} />;
    case 'hero':
      return <HeroRenderer {...component.props} />;
    case 'heading':
      return <HeadingRenderer {...component.props} />;
    case 'text':
      // Handle both legacy Text and new Primitive Text
      if ((component.props as any).content !== undefined && (component.props as any).fontSize !== undefined && typeof (component.props as any).fontSize === 'string' && !['small', 'medium', 'large'].includes((component.props as any).fontSize)) {
        return <PrimitiveTextRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
      }
      if ((component.props as any).children?.length > 0) {
        return <PrimitiveTextRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
      }
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
    case 'marquee':
      return <MarqueeRenderer {...component.props} />;
    case 'bento-grid':
      return <BentoGridRenderer {...component.props} />;
    case 'process-steps':
      return <ProcessStepsRenderer {...component.props} />;
    case 'logo-cloud':
      return <LogoCloudRenderer {...component.props} />;
    case 'layout-section':
      return <SectionRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
    case 'layout-container':
      return <ContainerRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
    case 'layout-stack':
      return <StackRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
    case 'layout-grid':
      return <LayoutGridRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
    case 'layout-columns':
      return <LayoutColumnsRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
    case 'box':
      return <BoxRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
    case 'flex':
      return <FlexRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
    case 'grid':
      return <GridRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
    case 'image-basic':
      return <ImageBasicRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
    case 'button-basic':
      return <ButtonBasicRenderer {...component.props} allComponents={allComponents} isEditing={isEditing} deviceMode={deviceMode} />;
    case 'content-paragraph':
      return <ParagraphRenderer {...component.props} />;
    case 'content-badge':
      return <BadgeRenderer {...component.props} />;
    case 'content-avatar':
      return <AvatarRenderer {...component.props} />;
    case 'ui-tabs':
      return <TabsRenderer {...component.props} />;
    case 'ui-carousel':
      return <CarouselRenderer {...component.props} />;
    case 'ui-breadcrumb':
      return <BreadcrumbRenderer {...component.props} />;
    case 'ui-accordion':
      return <UIAccordionRenderer {...component.props} />;
    case 'ui-dropdown':
      return <UIDropdownRenderer {...component.props} isEditing={isEditing} />;
    case 'ui-modal':
      return <UIModalRenderer {...component.props} isEditing={isEditing} />;
    case 'ui-tooltip':
      return <UITooltipRenderer {...component.props} />;
    case 'ui-toast':
      return <UIToastRenderer {...component.props} />;
    case 'ui-progress-bar':
      return <UIProgressBarRenderer {...component.props} />;
    case 'ui-skeleton-loader':
      return <UISkeletonLoaderRenderer {...component.props} />;
    case 'form-input':
      return <InputRenderer {...component.props} />;
    case 'form-checkbox':
      return <CheckboxRenderer {...component.props} />;
    case 'form-switch':
      return <SwitchRenderer {...component.props} />;
    case 'form-slider':
      return <SliderRenderer {...component.props} />;
    default:
      return <div className="p-4 text-muted-foreground">Unknown component</div>;
  }
}

// ============= Primitive Renderers =============

function RecursiveRenderer({
  childrenIds,
  allComponents,
  isEditing,
  deviceMode
}: {
  childrenIds?: string[],
  allComponents: PageComponent[],
  isEditing: boolean,
  deviceMode: any
}) {
  if (!childrenIds || childrenIds.length === 0) {
    if (isEditing) {
      return (
        <div className="p-4 border border-dashed border-muted-foreground/20 rounded text-center text-[10px] text-muted-foreground uppercase tracking-widest">
          Drop components here
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {childrenIds.map(id => {
        const child = allComponents.find(c => c.id === id);
        if (!child) return null;
        return (
          <ComponentRenderer
            key={id}
            component={child}
            allComponents={allComponents}
            isEditing={isEditing}
            deviceMode={deviceMode}
          />
        );
      })}
    </>
  );
}

function BoxRenderer(props: any) {
  const getResponsiveProp = (baseKey: string) => {
    if (props.deviceMode === 'desktop') return props[baseKey];
    return props[`${baseKey}_${props.deviceMode}`] || props[baseKey];
  };

  return (
    <Primitive.Box style={{ gap: getResponsiveProp('gap') }}>
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.Box>
  );
}

function FlexRenderer(props: any) {
  const getResponsiveProp = (baseKey: string) => {
    if (props.deviceMode === 'desktop') return props[baseKey];
    return props[`${baseKey}_${props.deviceMode}`] || props[baseKey];
  };

  return (
    <Primitive.Flex
      direction={props.direction}
      align={props.align}
      justify={props.justify}
      wrap={props.wrap}
      style={{ gap: getResponsiveProp('gap') }}
    >
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.Flex>
  );
}

function GridRenderer(props: any) {
  const getResponsiveProp = (baseKey: string) => {
    if (props.deviceMode === 'desktop') return props[baseKey];
    return props[`${baseKey}_${props.deviceMode}`] || props[baseKey];
  };

  return (
    <Primitive.Grid
      columns={props.columns}
      rows={props.rows}
      gap={getResponsiveProp('gap')}
    >
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.Grid>
  );
}

function PrimitiveTextRenderer(props: any) {
  return (
    <Primitive.Text
      content={props.content}
      color={props.color}
      fontSize={props.fontSize}
      fontWeight={props.fontWeight}
      textAlign={props.textAlign}
      lineHeight={props.lineHeight}
    >
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.Text>
  );
}

function ImageBasicRenderer(props: any) {
  return (
    <Primitive.ImageBasic
      src={props.src}
      alt={props.alt}
      objectFit={props.objectFit}
    >
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.ImageBasic>
  );
}

function ButtonBasicRenderer(props: any) {
  return (
    <Primitive.ButtonBasic
      text={props.text}
      url={props.isEditing ? undefined : props.url}
    >
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.ButtonBasic>
  );
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

// ============= New Renderers =============

function SectionRenderer(props: any) {
  const getResponsiveProp = (baseKey: string) => {
    if (props.deviceMode === 'desktop') return props[baseKey];
    return props[`${baseKey}_${props.deviceMode}`] || props[baseKey];
  };

  return (
    <Primitive.Box
      className={cn(
        "relative",
        props.fullWidth ? "w-full" : "max-w-7xl mx-auto rounded-3xl overflow-hidden"
      )}
      style={{
        backgroundColor: props.backgroundColor,
        backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: getResponsiveProp('padding'),
      }}
    >
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.Box>
  );
}

function ContainerRenderer(props: any) {
  const getResponsiveProp = (baseKey: string) => {
    if (props.deviceMode === 'desktop') return props[baseKey];
    return props[`${baseKey}_${props.deviceMode}`] || props[baseKey];
  };

  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  };

  return (
    <Primitive.Box
      className={cn("mx-auto", maxWidthClasses[props.maxWidth as keyof typeof maxWidthClasses] || 'max-w-screen-lg')}
      style={{ padding: getResponsiveProp('padding') }}
    >
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.Box>
  );
}

function StackRenderer(props: any) {
  const getResponsiveProp = (baseKey: string) => {
    if (props.deviceMode === 'desktop') return props[baseKey];
    return props[`${baseKey}_${props.deviceMode}`] || props[baseKey];
  };

  return (
    <Primitive.Flex
      direction={props.direction === 'horizontal' ? 'row' : 'column'}
      align={props.align}
      justify={props.justify}
      style={{
        gap: getResponsiveProp('gap'),
        padding: getResponsiveProp('padding')
      }}
    >
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.Flex>
  );
}

function LayoutGridRenderer(props: any) {
  const getResponsiveProp = (baseKey: string) => {
    if (props.deviceMode === 'desktop') return props[baseKey];
    return props[`${baseKey}_${props.deviceMode}`] || props[baseKey];
  };

  return (
    <Primitive.Grid
      columns={props.columns}
      rows={props.rows}
      gap={getResponsiveProp('gap')}
      style={{ padding: getResponsiveProp('padding') }}
    >
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.Grid>
  );
}

function LayoutColumnsRenderer(props: any) {
  const getResponsiveProp = (baseKey: string) => {
    if (props.deviceMode === 'desktop') return props[baseKey];
    return props[`${baseKey}_${props.deviceMode}`] || props[baseKey];
  };

  const count = props.count || 2;

  return (
    <Primitive.Grid
      columns={`repeat(${count}, minmax(0, 1fr))`}
      gap={getResponsiveProp('gap')}
      style={{ padding: getResponsiveProp('padding') }}
    >
      <RecursiveRenderer
        childrenIds={props.children}
        allComponents={props.allComponents}
        isEditing={props.isEditing}
        deviceMode={props.deviceMode}
      />
    </Primitive.Grid>
  );
}

function ParagraphRenderer(props: {
  text: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  fontSize: string;
  lineHeight: string;
}) {
  return (
    <p
      className={cn("leading-relaxed")}
      style={{
        textAlign: props.alignment,
        color: props.color,
        fontSize: props.fontSize,
        lineHeight: props.lineHeight
      }}
    >
      {props.text}
    </p>
  );
}

function BadgeRenderer(props: {
  text: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  size: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <Badge
      variant={props.variant}
      className={sizeClasses[props.size]}
    >
      {props.text}
    </Badge>
  );
}

function AvatarRenderer(props: {
  src?: string;
  fallback: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  shape: 'circle' | 'square';
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
  };

  return (
    <Avatar className={cn(sizeClasses[props.size], props.shape === 'square' && "rounded-lg")}>
      <AvatarImage src={props.src} />
      <AvatarFallback className={props.shape === 'square' ? "rounded-lg" : ""}>
        {props.fallback}
      </AvatarFallback>
    </Avatar>
  );
}

function TabsRenderer(props: {
  items: Array<{ label: string; content: string }>;
  variant: 'default' | 'outline';
}) {
  if (!props.items?.length) return null;

  return (
    <Tabs defaultValue={props.items[0].label} className="w-full">
      <TabsList
        className={cn("grid w-full", props.variant === 'outline' && "bg-transparent border")}
        style={{ gridTemplateColumns: `repeat(${props.items.length}, minmax(0, 1fr))` }}
      >
        {props.items.map((item, i) => (
          <TabsTrigger key={i} value={item.label}>{item.label}</TabsTrigger>
        ))}
      </TabsList>
      {props.items.map((item, i) => (
        <TabsContent key={i} value={item.label} className="p-4 border rounded-b-lg -mt-2">
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function CarouselRenderer(props: {
  images: string[];
  aspectRatio: string;
  autoplay: boolean;
  showArrows: boolean;
  showDots: boolean;
}) {
  if (!props.images?.length) return null;

  return (
    <Carousel
      className="w-full max-w-xl mx-auto"
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {props.images.map((src, i) => (
          <CarouselItem key={i}>
            <div className={cn("overflow-hidden rounded-3xl", props.aspectRatio || "aspect-video")}>
              <img src={src} className="w-full h-full object-cover" alt="" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {props.showArrows && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}

function BreadcrumbRenderer(props: {
  items: Array<{ label: string; url: string }>;
}) {
  if (!props.items?.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {props.items.map((item, i) => (
          <React.Fragment key={i}>
            <BreadcrumbItem>
              {i === props.items.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.url}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i < props.items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function InputRenderer(props: {
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  helpText?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{props.label} {props.required && <span className="text-destructive">*</span>}</Label>
      <Input type={props.type} placeholder={props.placeholder} required={props.required} />
      {props.helpText && <p className="text-xs text-muted-foreground">{props.helpText}</p>}
    </div>
  );
}

function CheckboxRenderer(props: {
  label: string;
  checked: boolean;
  required: boolean;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="check" defaultChecked={props.checked} required={props.required} />
      <Label htmlFor="check" className="text-sm font-medium leading-none cursor-pointer">
        {props.label}
      </Label>
    </div>
  );
}

function SwitchRenderer(props: {
  label: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="switch" defaultChecked={props.checked} />
      <Label htmlFor="switch" className="text-sm font-medium leading-none cursor-pointer">
        {props.label}
      </Label>
    </div>
  );
}

function SliderRenderer(props: {
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Label>{props.label}</Label>
        <span className="text-xs font-mono">{props.defaultValue}</span>
      </div>
      <Slider
        defaultValue={[props.defaultValue]}
        max={props.max}
        min={props.min}
        step={props.step}
      />
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
  layout?: 'card' | 'list' | 'minimal';
}) {
  const layout = props.layout || 'card';

  if (layout === 'list') {
    return (
      <a
        href={props.productUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group/product bg-card hover:bg-accent/30 border border-border rounded-2xl p-3 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-4">
          {props.image && (
            <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-border">
              <img src={props.image} alt={props.title} className="w-full h-full object-cover transition-transform group-hover/product:scale-110" />
            </div>
          )}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-0.5">
              {props.badge && (
                <span className="bg-primary text-primary-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  {props.badge}
                </span>
              )}
              <h3 className="font-bold text-sm truncate">{props.title}</h3>
            </div>
            {props.description && <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{props.description}</p>}
            <div className="text-sm font-black text-primary">{props.price}</div>
          </div>
          <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover/product:bg-primary group-hover/product:text-primary-foreground">
            <span className="text-lg">→</span>
          </div>
        </div>
      </a>
    );
  }

  if (layout === 'minimal') {
    return (
      <a
        href={props.productUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group/product bg-card hover:bg-accent/30 border border-border rounded-xl p-4 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-1 truncate">{props.title}</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-primary">{props.price}</span>
              {props.badge && (
                <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary" /> {props.badge}
                </span>
              )}
            </div>
          </div>
          <Button size="sm" className="rounded-full px-4 h-8 text-xs font-bold">
            {props.buttonText}
          </Button>
        </div>
      </a>
    );
  }

  // Default Card Layout (Enhanced Lynk-style)
  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl hover:-translate-y-1 group/product flex flex-col h-full shadow-sm">
      <div className="relative aspect-square overflow-hidden">
        {props.image ? (
          <img
            src={props.image}
            alt={props.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/product:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted/30 flex items-center justify-center text-muted-foreground">
            <span className="text-xs font-medium">No Product Image</span>
          </div>
        )}
        {props.badge && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
            {props.badge}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 bg-gradient-to-b from-transparent to-muted/5">
        <div className="flex-1 space-y-1.5 mb-4">
          <div className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">
            PROD #{props.productNo || '001'}
          </div>
          <h3 className="font-extrabold text-base leading-tight line-clamp-2 text-foreground group-hover/product:text-primary transition-colors tracking-tight">
            {props.title}
          </h3>

          {props.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
              {props.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 mt-auto">
          <div className="text-lg font-black text-primary tracking-tighter">
            {props.price}
          </div>
          <Button
            className="rounded-full font-black transition-all active:scale-90 px-4 h-9 text-xs uppercase tracking-wider"
            asChild
          >
            <a href={props.productUrl} target="_blank" rel="noopener noreferrer">
              {props.buttonText}
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

function MarqueeRenderer(props: {
  items: string[];
  speed: number;
  direction: 'left' | 'right';
  pauseOnHover: boolean;
  gap: string;
}) {
  return (
    <div className="overflow-hidden whitespace-nowrap py-6 bg-accent/20 border-y border-border group">
      <motion.div
        className="flex items-center w-max"
        animate={{
          x: props.direction === 'left' ? [0, "-50%"] : ["-50%", 0],
        }}
        transition={{
          duration: props.speed,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ gap: props.gap }}
      >
        {/* Render items twice for seamless loop with -50% translation */}
        {[...props.items, ...props.items].map((item, i) => (
          <span
            key={i}
            className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-foreground/50 hover:text-primary transition-colors px-4"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function BentoGridRenderer(props: {
  items: Array<{ title: string; description: string; image?: string; size: 'small' | 'medium' | 'large'; color?: string }>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 auto-rows-[250px]">
      {props.items.map((item, i) => (
        <div
          key={i}
          className={cn(
            'rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group/bento transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-border',
            item.size === 'large' ? 'md:col-span-2 md:row-span-2' :
            item.size === 'medium' ? 'md:col-span-2' : 'md:col-span-1'
          )}
          style={{ backgroundColor: item.color || 'var(--card)' }}
        >
          {item.image && (
            <div className="absolute inset-0 z-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/bento:scale-110 opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          )}
          <div className="relative z-10">
            <h3 className={cn(
              "font-bold mb-2 tracking-tight",
              item.size === 'large' ? 'text-3xl' : 'text-xl',
              item.image ? 'text-white' : 'text-foreground'
            )}>{item.title}</h3>
            <p className={cn(
              "text-sm line-clamp-2",
              item.image ? 'text-white/70' : 'text-muted-foreground'
            )}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProcessStepsRenderer(props: {
  steps: Array<{ title: string; description: string; icon: string }>;
  layout: 'vertical' | 'horizontal';
  color?: string;
}) {
  return (
    <div className={cn(
      'grid gap-8 py-8',
      props.layout === 'horizontal' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 max-w-2xl mx-auto'
    )}>
      {props.steps.map((step, i) => (
        <div key={i} className={cn(
          "flex items-start gap-4 group/step",
          props.layout === 'vertical' ? 'flex-row' : 'flex-col'
        )}>
          <div className="relative shrink-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform duration-300 group-hover/step:rotate-12 group-hover/step:scale-110"
              style={{ backgroundColor: props.color || 'var(--primary)', color: 'white' }}
            >
              {step.icon}
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center text-[10px] font-bold">
              {i + 1}
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-lg tracking-tight">{step.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LogoCloudRenderer(props: {
  logos: Array<{ src: string; alt: string; url?: string }>;
  title?: string;
  style: 'grid' | 'marquee' | 'simple';
}) {
  if (props.style === 'marquee') {
    return (
      <div className="py-12 space-y-8">
        {props.title && <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">{props.title}</p>}
        <div className="overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <motion.div
            className="flex gap-20 items-center w-max px-10"
            animate={{ x: [0, "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...props.logos, ...props.logos].map((logo, i) => (
              <img key={i} src={logo.src} alt={logo.alt} className="h-8 md:h-12 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 space-y-8">
      {props.title && <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">{props.title}</p>}
      <div className={cn(
        "flex flex-wrap items-center justify-center gap-x-12 gap-y-8",
        props.style === 'grid' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6" : ""
      )}>
        {props.logos.map((logo, i) => (
          <div key={i} className="flex items-center justify-center">
            <img src={logo.src} alt={logo.alt} className="h-8 md:h-10 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= UI Renderers =============

function UIAccordionRenderer(props: {
  items: Array<{ title: string; content: string }>;
  variant: 'default' | 'bordered' | 'separated';
}) {
  if (!props.items?.length) return <div className="p-4 text-muted-foreground italic">No accordion items</div>;

  return (
    <Accordion
      type="single"
      collapsible
      className={cn(
        "w-full",
        props.variant === 'separated' && "space-y-4 border-none"
      )}
    >
      {props.items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className={cn(
            props.variant === 'bordered' && "border px-4 rounded-lg mb-2",
            props.variant === 'separated' && "border rounded-xl px-4 bg-card shadow-sm"
          )}
        >
          <AccordionTrigger className="hover:no-underline font-semibold">{item.title}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function UIDropdownRenderer(props: {
  label: string;
  items: Array<{ label: string; url: string }>;
  variant: 'default' | 'outline';
  isEditing?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={props.variant === 'outline' ? 'outline' : 'default'} className="rounded-full px-6">
          {props.label || 'Dropdown'} <span className="ml-2 opacity-50">▼</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {props.items?.map((item, i) => (
          <DropdownMenuItem key={i} asChild={!props.isEditing}>
            {props.isEditing ? (
              <span>{item.label}</span>
            ) : (
              <a href={item.url}>{item.label}</a>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UIModalRenderer(props: {
  triggerText: string;
  title: string;
  description: string;
  variant: 'default' | 'glass';
  isEditing?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={props.variant === 'glass' ? 'outline' : 'default'} className={cn(
          "rounded-xl",
          props.variant === 'glass' && "bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
        )}>
          {props.triggerText || 'Open Modal'}
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "sm:max-w-[425px] rounded-[2rem]",
        props.variant === 'glass' && "bg-white/80 backdrop-blur-xl border-white/20"
      )}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">{props.title || 'Modal Title'}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {props.description || 'Provide a description for your modal here.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground italic">Modal content area. You can add more components here in a real scenario.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UITooltipRenderer(props: {
  text: string;
  content: string;
  variant: 'default' | 'dark';
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block px-2 py-1 bg-muted rounded cursor-help border border-dashed border-muted-foreground/30 text-sm font-medium">
            {props.text || 'Hover me'}
          </span>
        </TooltipTrigger>
        <TooltipContent className={cn(
          props.variant === 'dark' && "bg-slate-900 text-slate-50 border-slate-800"
        )}>
          <p>{props.content || 'Tooltip content goes here'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function UIToastRenderer(props: {
  title: string;
  description: string;
  variant: 'default' | 'success' | 'destructive';
}) {
  const variantClasses = {
    default: "bg-background border-border text-foreground",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    destructive: "bg-destructive text-destructive-foreground border-transparent",
  };

  return (
    <div className={cn(
      "max-w-xs w-full p-4 rounded-xl border shadow-lg flex flex-col gap-1 transition-all hover:scale-105",
      variantClasses[props.variant || 'default']
    )}>
      <div className="font-bold text-sm">{props.title || 'Toast Title'}</div>
      <div className="text-xs opacity-90">{props.description || 'This is how a toast notification looks.'}</div>
    </div>
  );
}

function UIProgressBarRenderer(props: {
  value: number;
  max: number;
  variant: 'default' | 'success' | 'warning';
  showValue: boolean;
}) {
  const value = props.value || 0;
  const max = props.max || 100;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantColors = {
    default: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
        {props.showValue && <span>Progress</span>}
        {props.showValue && <span>{Math.round(percentage)}%</span>}
      </div>
      <div className="h-3 w-full bg-muted rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={cn("h-full rounded-full transition-all", variantColors[props.variant || 'default'])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function UISkeletonLoaderRenderer(props: {
  type: 'text' | 'circle' | 'rect';
  count: number;
  variant: 'pulse' | 'wave';
}) {
  const count = props.count || 1;
  const items = Array.from({ length: count });

  return (
    <Primitive.Flex direction="column" gap="12px">
      {items.map((_, i) => (
        <div key={i} className="flex gap-4 items-center w-full">
          {props.type === 'circle' && <Skeleton className="h-12 w-12 rounded-full shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className={cn(
              "h-4 w-full",
              props.type === 'rect' && "h-24"
            )} />
            {props.type === 'circle' && <Skeleton className="h-4 w-[80%]" />}
          </div>
        </div>
      ))}
    </Primitive.Flex>
  );
}
