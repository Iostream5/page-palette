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
  {
    id: 'forms',
    name: 'Forms',
    icon: '📋',
    components: [
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
      {
        type: 'faq',
        name: 'FAQ',
        description: 'Frequently asked questions',
        icon: '❓',
        defaultProps: {
          items: [
            { question: 'What is this product?', answer: 'This is an amazing product that helps you achieve your goals.' },
            { question: 'How do I get started?', answer: 'Simply sign up and follow our quick setup guide.' },
            { question: 'Is there a free trial?', answer: 'Yes! We offer a 14-day free trial with full access.' },
          ],
          style: 'accordion',
        },
      },
    ],
  },
];
