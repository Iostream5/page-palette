// Component Library Presets
import { ComponentCategory, PageComponentType, PageComponent } from '@/types/page-components';

// Generate unique ID for components
export function generateComponentId(): string {
  return `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Create a new component instance from preset
export function createComponentFromPreset(
  type: PageComponentType,
  order: number
): PageComponent {
  const preset = getAllPresets().find(p => p.type === type);
  if (!preset) {
    throw new Error(`Unknown component type: ${type}`);
  }

  return {
    id: generateComponentId(),
    type,
    order,
    visible: true,
    props: { ...preset.defaultProps },
  } as PageComponent;
}

// Get all presets flat list
export function getAllPresets() {
  return COMPONENT_CATEGORIES.flatMap(cat => cat.components);
}

// Component categories with presets
export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    id: 'primitives',
    name: 'Primitives',
    icon: '🧱',
    components: [
      {
        type: 'box',
        name: 'Box',
        description: 'Basic container for layout and grouping',
        icon: '📦',
        defaultProps: {
          padding: '20px',
          background: 'transparent',
          children: [],
        },
      },
      {
        type: 'flex',
        name: 'Flex',
        description: 'Flexible layout container',
        icon: '↔️',
        defaultProps: {
          direction: 'row',
          align: 'center',
          justify: 'start',
          gap: '10px',
          children: [],
        },
      },
      {
        type: 'grid',
        name: 'Grid',
        description: 'Grid-based layout container',
        icon: '▦',
        defaultProps: {
          columns: 'repeat(2, minmax(0, 1fr))',
          gap: '10px',
          children: [],
        },
      },
      {
        type: 'text',
        name: 'Text (Basic)',
        description: 'Basic text component with custom styling',
        icon: 'Aa',
        defaultProps: {
          content: 'Basic text content',
          fontSize: '16px',
          children: [],
        },
      },
      {
        type: 'image-basic',
        name: 'Image (Basic)',
        description: 'Simple image component',
        icon: '🖼️',
        defaultProps: {
          src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
          alt: 'Primitive image',
          objectFit: 'cover',
          width: '100%',
          height: '200px',
        },
      },
      {
        type: 'button-basic',
        name: 'Button (Basic)',
        description: 'Simple customizable button',
        icon: '🔘',
        defaultProps: {
          text: 'Primitive Button',
          padding: '10px 20px',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
        },
      },
    ],
  },
  {
    id: 'layout',
    name: 'Layout',
    icon: '📐',
    components: [
      {
        type: 'hero',
        name: 'Hero Section',
        description: 'Large header with title, subtitle, and CTA',
        icon: '🎯',
        defaultProps: {
          title: 'Welcome to My Page',
          subtitle: 'Create something amazing today',
          backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          ctaText: 'Get Started',
          ctaUrl: '#',
          alignment: 'center',
          height: 'medium',
        },
      },
      {
        type: 'layout-section',
        name: 'Section Wrapper',
        description: 'Large content area with background options',
        icon: '🔲',
        defaultProps: {
          backgroundColor: '#ffffff',
          padding: '80px 20px',
          fullWidth: true,
        },
      },
      {
        type: 'layout-container',
        name: 'Container',
        description: 'Centered content wrapper with max width',
        icon: '📦',
        defaultProps: {
          maxWidth: 'lg',
          padding: '20px',
        },
      },
      {
        type: 'layout-stack',
        name: 'Flex Stack',
        description: 'Flexible layout for aligning children',
        icon: '🥞',
        defaultProps: {
          direction: 'vertical',
          gap: '20px',
          align: 'stretch',
          justify: 'start',
        },
      },
      {
        type: 'spacer',
        name: 'Spacer',
        description: 'Add vertical spacing between components',
        icon: '↕️',
        defaultProps: {
          height: 'medium',
        },
      },
      {
        type: 'divider',
        name: 'Divider',
        description: 'Horizontal line to separate content',
        icon: '➖',
        defaultProps: {
          style: 'solid',
          thickness: 'thin',
        },
      },
      {
        type: 'marquee',
        name: 'Scrolling Marquee',
        description: 'Continuous scrolling text for modern landing pages',
        icon: '🎞️',
        defaultProps: {
          items: ['Modern Design', 'Fast Performance', 'Easy to Use', 'Fully Responsive'],
          speed: 20,
          direction: 'left',
          pauseOnHover: true,
          gap: '40px',
        },
      },
    ],
  },
  {
    id: 'content',
    name: 'Content',
    icon: '📝',
    components: [
      {
        type: 'heading',
        name: 'Heading',
        description: 'Title or section header',
        icon: '🔤',
        defaultProps: {
          text: 'Section Title',
          level: 'h2',
          alignment: 'left',
        },
      },
      {
        type: 'text',
        name: 'Text Block',
        description: 'Paragraph or rich text content',
        icon: '📄',
        defaultProps: {
          content: 'Add your text content here. You can write paragraphs, descriptions, or any other text information.',
          alignment: 'left',
          fontSize: 'medium',
        },
      },
      {
        type: 'content-paragraph',
        name: 'Paragraph',
        description: 'Detailed text block with custom styling',
        icon: '📑',
        defaultProps: {
          text: 'Modern web design is all about clean aesthetics and smooth user experiences. Use this component to tell your story in a readable and elegant way.',
          alignment: 'left',
          fontSize: '16px',
          lineHeight: '1.6',
        },
      },
      {
        type: 'content-badge',
        name: 'Status Badge',
        description: 'Small pill-style label for status or tags',
        icon: '🏷️',
        defaultProps: {
          text: 'New Feature',
          variant: 'default',
          size: 'md',
        },
      },
      {
        type: 'content-avatar',
        name: 'Avatar',
        description: 'User profile image or fallback initials',
        icon: '👤',
        defaultProps: {
          fallback: 'JD',
          size: 'md',
          shape: 'circle',
        },
      },
      {
        type: 'image',
        name: 'Image',
        description: 'Display an image with caption',
        icon: '🖼️',
        defaultProps: {
          src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
          alt: 'Image description',
          caption: '',
          aspectRatio: '16:9',
          rounded: true,
          shadow: true,
        },
      },
      {
        type: 'video',
        name: 'Video',
        description: 'Embed a video player',
        icon: '🎬',
        defaultProps: {
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          autoplay: false,
          muted: false,
          loop: false,
          aspectRatio: '16:9',
        },
      },
      {
        type: 'bento-grid',
        name: 'Bento Grid',
        description: 'Elegant asymmetrical grid for features',
        icon: '🍱',
        defaultProps: {
          items: [
            { title: 'Feature One', description: 'A brief description of this cool feature.', size: 'large', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' },
            { title: 'Feature Two', description: 'Short and sweet description.', size: 'small', color: '#f3f4f6' },
            { title: 'Feature Three', description: 'Another interesting detail.', size: 'medium', color: '#e5e7eb' },
          ],
        },
      },
    ],
  },
  {
    id: 'interactive',
    name: 'Interactive',
    icon: '👆',
    components: [
      {
        type: 'button',
        name: 'Button',
        description: 'Clickable button with link',
        icon: '🔘',
        defaultProps: {
          text: 'Click Me',
          url: '#',
          variant: 'primary',
          size: 'medium',
          fullWidth: false,
        },
      },
      {
        type: 'ui-tabs',
        name: 'Tab Switcher',
        description: 'Toggle between different content sections',
        icon: '🗂️',
        defaultProps: {
          items: [
            { label: 'Tab 1', content: 'Content for the first tab goes here.' },
            { label: 'Tab 2', content: 'Explore more details in the second tab.' },
          ],
          variant: 'default',
        },
      },
      {
        type: 'ui-carousel',
        name: 'Image Slider',
        description: 'Swipeable carousel for multiple images',
        icon: '🎠',
        defaultProps: {
          images: [
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            'https://images.unsplash.com/photo-1482933230644-40ff1577e02a?w=800',
          ],
          aspectRatio: 'aspect-video',
          autoplay: true,
          showArrows: true,
          showDots: true,
        },
      },
      {
        type: 'ui-breadcrumb',
        name: 'Breadcrumbs',
        description: 'Navigation path for nested pages',
        icon: '🍞',
        defaultProps: {
          items: [
            { label: 'Home', url: '/' },
            { label: 'Products', url: '/products' },
            { label: 'Headphones', url: '#' },
          ],
        },
      },
      {
        type: 'cta',
        name: 'Call to Action',
        description: 'Highlight section with action button',
        icon: '📣',
        defaultProps: {
          title: 'Ready to get started?',
          description: 'Join thousands of happy users today.',
          buttonText: 'Sign Up Now',
          buttonUrl: '#',
          variant: 'gradient',
        },
      },
      {
        type: 'social-links',
        name: 'Social Links',
        description: 'Social media profile links',
        icon: '🔗',
        defaultProps: {
          links: [
            { platform: 'twitter', url: '#' },
            { platform: 'instagram', url: '#' },
            { platform: 'linkedin', url: '#' },
          ],
          style: 'icons',
          size: 'medium',
        },
      },
    ],
  },
  {
    id: 'forms',
    name: 'Forms',
    icon: '📋',
    components: [
      {
        type: 'form-input',
        name: 'Text Input',
        description: 'Standard text field for forms',
        icon: '⌨️',
        defaultProps: {
          label: 'Your Name',
          placeholder: 'John Doe',
          type: 'text',
          required: true,
        },
      },
      {
        type: 'form-checkbox',
        name: 'Checkbox',
        description: 'Selection box for agreements',
        icon: '☑️',
        defaultProps: {
          label: 'I agree to the terms and conditions',
          checked: false,
          required: true,
        },
      },
      {
        type: 'form-switch',
        name: 'Toggle Switch',
        description: 'On/off switch for settings',
        icon: '🎚️',
        defaultProps: {
          label: 'Enable notifications',
          checked: true,
        },
      },
      {
        type: 'form-slider',
        name: 'Range Slider',
        description: 'Draggable slider for numeric values',
        icon: '↔️',
        defaultProps: {
          label: 'Budget Range',
          min: 0,
          max: 1000,
          step: 50,
          defaultValue: 500,
        },
      },
      {
        type: 'newsletter',
        name: 'Newsletter',
        description: 'Email subscription form',
        icon: '📧',
        defaultProps: {
          title: 'Subscribe to our newsletter',
          description: 'Get the latest updates directly in your inbox.',
          placeholder: 'Enter your email',
          buttonText: 'Subscribe',
          style: 'stacked',
        },
      },
      {
        type: 'contact-form',
        name: 'Contact Form',
        description: 'Simple contact form',
        icon: '✉️',
        defaultProps: {
          title: 'Get in Touch',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'email', type: 'email', required: true },
            { name: 'message', type: 'textarea', required: true },
          ],
          submitText: 'Send Message',
        },
      },
    ],
  },
  {
    id: 'cards',
    name: 'Cards',
    icon: '🃏',
    components: [
      {
        type: 'card',
        name: 'Content Card',
        description: 'Card with title, description, and image',
        icon: '📋',
        defaultProps: {
          title: 'Card Title',
          description: 'Card description goes here. Add more details about this item.',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
          ctaText: 'Learn More',
          ctaUrl: '#',
          variant: 'elevated',
        },
      },
      {
        type: 'testimonial',
        name: 'Testimonial',
        description: 'Customer review or quote',
        icon: '💬',
        defaultProps: {
          quote: 'This product has completely transformed how I work. Highly recommended!',
          author: 'Jane Doe',
          role: 'CEO, Company',
          rating: 5,
        },
      },
      {
        type: 'pricing',
        name: 'Pricing Card',
        description: 'Pricing plan with features',
        icon: '💰',
        defaultProps: {
          title: 'Pro Plan',
          price: '$29',
          period: '/month',
          features: ['Unlimited access', 'Priority support', 'Custom branding', 'Analytics'],
          ctaText: 'Choose Plan',
          ctaUrl: '#',
          highlighted: false,
        },
      },
    ],
  },
  {
    id: 'data',
    name: 'Data Display',
    icon: '📊',
    components: [
      {
        type: 'stats',
        name: 'Statistics',
        description: 'Display key metrics and numbers',
        icon: '📈',
        defaultProps: {
          items: [
            { value: '10K+', label: 'Users' },
            { value: '99%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
          ],
          layout: 'row',
        },
      },
      {
        type: 'feature-grid',
        name: 'Feature Grid',
        description: 'Grid of features with icons',
        icon: '🔲',
        defaultProps: {
          columns: 3,
          items: [
            { icon: '⚡', title: 'Fast', description: 'Lightning quick performance' },
            { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
            { icon: '🎨', title: 'Beautiful', description: 'Stunning modern design' },
          ],
        },
      },
      {
        type: 'process-steps',
        name: 'Process Steps',
        description: 'Clean visual workflow or steps',
        icon: '🪜',
        defaultProps: {
          steps: [
            { title: 'Step 1', description: 'Research and planning', icon: '🔍' },
            { title: 'Step 2', description: 'Design and prototype', icon: '🎨' },
            { title: 'Step 3', description: 'Develop and launch', icon: '🚀' },
          ],
          layout: 'horizontal',
          color: '#6366f1',
        },
      },
      {
        type: 'icon-list',
        name: 'Icon List',
        description: 'List with icons',
        icon: '📋',
        defaultProps: {
          items: [
            { icon: '✓', text: 'Easy to use' },
            { icon: '✓', text: 'Fully customizable' },
            { icon: '✓', text: 'Mobile responsive' },
          ],
          layout: 'vertical',
        },
      },
      {
        type: 'countdown',
        name: 'Countdown Timer',
        description: 'Countdown to a specific date',
        icon: '⏰',
        defaultProps: {
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          title: 'Coming Soon',
          style: 'flip',
        },
      },
      {
        type: 'logo-cloud',
        name: 'Logo Cloud',
        description: 'Display partner or client logos',
        icon: '☁️',
        defaultProps: {
          title: 'Trusted by world-class companies',
          logos: [
            { src: 'https://cdn.worldvectorlogo.com/logos/google-2015.svg', alt: 'Google' },
            { src: 'https://cdn.worldvectorlogo.com/logos/apple-11.svg', alt: 'Apple' },
            { src: 'https://cdn.worldvectorlogo.com/logos/microsoft-5.svg', alt: 'Microsoft' },
            { src: 'https://cdn.worldvectorlogo.com/logos/amazon-2.svg', alt: 'Amazon' },
          ],
          style: 'simple',
        },
      },
    ],
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    components: [
      {
        type: 'product-item',
        name: 'Product Item',
        description: 'Affiliate product card with price and link',
        icon: '🏷️',
        defaultProps: {
          title: 'Premium Wireless Headphones',
          productNo: '001',
          productUrl: 'https://shopee.com',
          price: 'Rp 1.299.000',
          description: 'High-quality sound with active noise cancellation and 30-hour battery life.',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          buttonText: 'Beli Sekarang',
          badge: 'Best Seller',
          layout: 'card',
        },
      },
    ],
  },
];
