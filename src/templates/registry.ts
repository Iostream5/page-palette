import { TemplateRegistry } from './types';
import NeonGlow, { NeonGlowEditor } from './definitions/linktree/NeonGlow';
import Glassmorphism, { GlassmorphismEditor } from './definitions/linktree/Glassmorphism';
import RetroWave, { RetroWaveEditor } from './definitions/linktree/RetroWave';
import MinimalLinks, { MinimalLinksEditor } from './definitions/linktree/MinimalLinks';
import GradientLinks, { GradientLinksEditor } from './definitions/linktree/GradientLinks';
import MasonryDark, { MasonryDarkEditor } from './definitions/gallery/MasonryDark';
import GridGallery, { GridGalleryEditor } from './definitions/gallery/GridGallery';
import ClassicLetter, { ClassicLetterEditor } from './definitions/letter/ClassicLetter';
import StandardCustom, { StandardCustomEditor } from './definitions/custom/StandardCustom';

export const templateRegistry: TemplateRegistry = {
  // LINKTREE CATEGORY
  '7c314643-98f4-4514-b27e-e0b4b5c9de6a': {
    id: '7c314643-98f4-4514-b27e-e0b4b5c9de6a',
    slug: 'minimal-links',
    name: 'Minimal Links',
    category: 'linktree',
    description: 'A clean and simple link page with a focused layout.',
    component: MinimalLinks,
    editor: MinimalLinksEditor,
    default_data: {
      profile: { name: 'Your Name', bio: 'Minimalist', avatar: '' },
      links: [{ title: 'Website', url: 'https://example.com' }],
      theme: { background: '#ffffff', buttonColor: '#f8fafc', textColor: '#0f172a' }
    }
  },
  '22dd00ad-40c2-425e-9801-83af98e3d35d': {
    id: '22dd00ad-40c2-425e-9801-83af98e3d35d',
    slug: 'gradient-links',
    name: 'Gradient Links',
    category: 'linktree',
    description: 'Vibrant gradient backgrounds with modern glass elements.',
    component: GradientLinks,
    editor: GradientLinksEditor,
    default_data: {
      profile: { name: 'Your Name', bio: 'Creative Director', avatar: '' },
      links: [{ title: 'Social Media', url: 'https://example.com' }],
      theme: { background: 'linear-gradient(to bottom, #6366f1, #a855f7)', textColor: '#ffffff' }
    }
  },
  '63130804-b376-4595-9ca4-1e593a6160b4': {
    id: '63130804-b376-4595-9ca4-1e593a6160b4',
    slug: 'neon-glow',
    name: 'Neon Glow',
    category: 'linktree',
    description: 'A vibrant neon-themed link page with pulsing animations.',
    component: NeonGlow,
    editor: NeonGlowEditor,
    default_data: {
      profile: { name: 'Your Name', bio: 'Content Creator', avatar: '' },
      links: [{ title: 'Instagram', url: 'https://instagram.com' }],
      theme: { background: '#0a0a0a', buttonColor: '#00ff88', textColor: '#ffffff' }
    }
  },
  'a340ac35-637a-4cb0-b09b-d1968f736824': {
    id: 'a340ac35-637a-4cb0-b09b-d1968f736824',
    slug: 'glassmorphism',
    name: 'Glassmorphism',
    category: 'linktree',
    description: 'Modern glass-style UI with soft blur and gradients.',
    component: Glassmorphism,
    editor: GlassmorphismEditor,
    default_data: {
      profile: { name: 'Your Name', bio: 'Designer', avatar: '' },
      links: [{ title: 'Portfolio', url: 'https://example.com' }],
      theme: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', buttonColor: 'rgba(255,255,255,0.1)', textColor: '#ffffff' }
    }
  },
  '42642365-cc84-4e38-a56f-edb7c1b528cb': {
    id: '42642365-cc84-4e38-a56f-edb7c1b528cb',
    slug: 'retro-wave',
    name: 'Retro Wave',
    category: 'linktree',
    description: '80s inspired retro aesthetic with synthwave vibes.',
    component: RetroWave,
    editor: RetroWaveEditor,
    default_data: {
      profile: { name: 'YOUR NAME', bio: 'RETRO ENTHUSIAST', avatar: '' },
      links: [{ title: 'ENTER THE VOID', url: 'https://example.com' }],
      theme: { background: '#2d0a4e', buttonColor: '#ff00ff', textColor: '#00ffff' }
    }
  },

  // GALLERY CATEGORY
  '5ec04c82-dc19-4c31-bbca-eb368c446cb2': {
    id: '5ec04c82-dc19-4c31-bbca-eb368c446cb2',
    slug: 'grid-gallery',
    name: 'Grid Gallery',
    category: 'gallery',
    description: 'A clean grid layout for showcasing your photo collection.',
    component: GridGallery,
    editor: GridGalleryEditor,
    default_data: {
      header: { title: 'My Portfolio', description: 'Selected photography works' },
      photos: [
        { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800', caption: 'Nature' },
        { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', caption: 'Exploration' }
      ],
      theme: { background: '#f8fafc', textColor: '#0f172a' }
    }
  },
  '205aeef9-55e5-4e65-8962-41aa88f24ad3': {
    id: '205aeef9-55e5-4e65-8962-41aa88f24ad3',
    slug: 'masonry-dark',
    name: 'Masonry Dark',
    category: 'gallery',
    description: 'A professional dark-themed photo gallery with masonry layout.',
    component: MasonryDark,
    editor: MasonryDarkEditor,
    default_data: {
      header: { title: 'My Gallery', description: 'A collection of my best shots.' },
      photos: [
        { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800', caption: 'Landscape' },
        { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', caption: 'Forest' }
      ],
      theme: { background: '#0f172a', textColor: '#f8fafc', accentColor: '#3b82f6' }
    }
  },
  '6c086b2b-9a45-4f5a-828a-9bb29b6a1bf8': {
    id: '6c086b2b-9a45-4f5a-828a-9bb29b6a1bf8',
    slug: 'masonry-gallery',
    name: 'Masonry Gallery',
    category: 'gallery',
    description: 'Elegant masonry layout for your photos.',
    component: MasonryDark,
    editor: MasonryDarkEditor,
    default_data: {
      header: { title: 'Photography', description: 'Captured moments' },
      photos: [],
      theme: { background: '#ffffff', textColor: '#1a1a1a' }
    }
  },

  // LETTER CATEGORY
  '7e025846-b69e-465e-9189-311c5522be3b': {
    id: '7e025846-b69e-465e-9189-311c5522be3b',
    slug: 'classic-letter',
    name: 'Classic Letter',
    category: 'letter',
    description: 'A timeless letter layout with elegant typography.',
    component: ClassicLetter,
    editor: ClassicLetterEditor,
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
  '4c02dcad-7c0f-461c-a316-eed9e8783a8d': {
    id: '4c02dcad-7c0f-461c-a316-eed9e8783a8d',
    slug: 'modern-document',
    name: 'Modern Document',
    category: 'letter',
    description: 'A clean, modern document layout.',
    component: ClassicLetter,
    editor: ClassicLetterEditor,
    default_data: {
      letter: { title: 'Update', date: 'Feb 2026', greeting: 'Hello,', body: 'Modern style.', closing: 'Best,', signature: 'Admin' },
      theme: { background: '#ffffff', textColor: '#111827', fontFamily: 'sans-serif' }
    }
  },

  // CUSTOM CATEGORY
  '34b49192-bcae-4ef6-8318-2421dec787c8': {
    id: '34b49192-bcae-4ef6-8318-2421dec787c8',
    slug: 'standard-custom',
    name: 'Standard Custom',
    category: 'custom',
    description: 'The standard custom builder template.',
    component: StandardCustom,
    editor: StandardCustomEditor,
    default_data: {
      pageComponents: [],
      brandKit: { primaryColor: '#3b82f6', fontFamily: 'Inter, sans-serif' }
    }
  }
};

export function getTemplateById(id: string) {
  if (templateRegistry[id]) return templateRegistry[id];
  return Object.values(templateRegistry).find(t => t.id === id || t.slug === id || t.name === id);
}

export function getAllTemplates() {
  return Object.values(templateRegistry);
}

export function getTemplatesByCategory(category: string) {
  return Object.values(templateRegistry).filter(t => t.category === category);
}
