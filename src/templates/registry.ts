import { TemplateRegistry } from './types';
import NeonGlow from './definitions/linktree/NeonGlow';
import Glassmorphism from './definitions/linktree/Glassmorphism';
import RetroWave from './definitions/linktree/RetroWave';
import MasonryDark from './definitions/gallery/MasonryDark';
import ClassicLetter from './definitions/letter/ClassicLetter';
import StandardCustom from './definitions/custom/StandardCustom';

export const templateRegistry: TemplateRegistry = {
  'neon-glow': {
    id: 'neon-glow',
    name: 'Neon Glow',
    category: 'linktree',
    description: 'A vibrant neon-themed link page with pulsing animations.',
    component: NeonGlow,
    default_data: {
      profile: { name: 'Your Name', bio: 'Content Creator', avatar: '' },
      links: [{ title: 'Instagram', url: 'https://instagram.com' }],
      theme: { background: '#0a0a0a', buttonColor: '#00ff88', textColor: '#ffffff' }
    }
  },
  'glassmorphism': {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    category: 'linktree',
    description: 'Modern glass-style UI with soft blur and gradients.',
    component: Glassmorphism,
    default_data: {
      profile: { name: 'Your Name', bio: 'Designer', avatar: '' },
      links: [{ title: 'Portfolio', url: 'https://example.com' }],
      theme: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', buttonColor: 'rgba(255,255,255,0.1)', textColor: '#ffffff' }
    }
  },
  'retro-wave': {
    id: 'retro-wave',
    name: 'Retro Wave',
    category: 'linktree',
    description: '80s inspired retro aesthetic with synthwave vibes.',
    component: RetroWave,
    default_data: {
      profile: { name: 'YOUR NAME', bio: 'RETRO ENTHUSIAST', avatar: '' },
      links: [{ title: 'ENTER THE VOID', url: 'https://example.com' }],
      theme: { background: '#2d0a4e', buttonColor: '#ff00ff', textColor: '#00ffff' }
    }
  },
  'masonry-dark': {
    id: 'masonry-dark',
    name: 'Masonry Dark',
    category: 'gallery',
    description: 'A professional dark-themed photo gallery with masonry layout.',
    component: MasonryDark,
    default_data: {
      header: { title: 'My Gallery', description: 'A collection of my best shots.' },
      photos: [
        { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800', caption: 'Landscape' },
        { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', caption: 'Forest' }
      ],
      theme: { background: '#0f172a', textColor: '#f8fafc', accentColor: '#3b82f6' }
    }
  },
  'classic-letter': {
    id: 'classic-letter',
    name: 'Classic Letter',
    category: 'letter',
    description: 'A timeless letter layout with elegant typography.',
    component: ClassicLetter,
    default_data: {
      letter: {
        title: 'A Special Message',
        date: 'February 2026',
        greeting: 'Dear Reader,',
        body: 'This is a classic letter template.',
        closing: 'With warm regards,',
        signature: 'Your Name'
      },
      theme: { background: '#fffef0', textColor: '#2d3436', fontFamily: 'serif' }
    }
  },
  'standard-custom': {
    id: 'standard-custom',
    name: 'Standard Custom',
    category: 'custom',
    description: 'The standard custom builder template.',
    component: StandardCustom,
    default_data: {
      pageComponents: [],
      brandKit: { primaryColor: '#3b82f6', fontFamily: 'Inter, sans-serif' }
    }
  }
};

export function getTemplateById(id: string) {
  // Try finding by ID directly, or by name match if ID is from older DB entries
  if (templateRegistry[id]) return templateRegistry[id];
  return Object.values(templateRegistry).find(t => t.name === id || t.id === id);
}

export function getAllTemplates() {
  return Object.values(templateRegistry);
}

export function getTemplatesByCategory(category: string) {
  return Object.values(templateRegistry).filter(t => t.category === category);
}
