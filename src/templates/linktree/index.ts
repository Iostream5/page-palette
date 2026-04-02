import { TemplateDefinition } from '../types';
import { LinktreeBase } from './LinktreeBase';

const commonSchema = {
  sections: [
    {
      type: 'profile',
      fields: [
        { name: 'avatar', type: 'image', label: 'Profile Image' },
        { name: 'name', type: 'text', label: 'Display Name' },
        { name: 'bio', type: 'textarea', label: 'Bio' }
      ]
    },
    {
      type: 'links',
      fields: [
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          itemFields: [
            { name: 'title', type: 'text', label: 'Title' },
            { name: 'url', type: 'url', label: 'URL' }
          ]
        }
      ]
    }
  ]
};

export const MinimalLinks: TemplateDefinition = {
  id: '7c314643-98f4-4514-b27e-e0b4b5c9de6a',
  name: 'Minimal Links',
  category: 'linktree',
  description: 'A clean, minimal link page',
  schema: commonSchema as any,
  defaultData: {
    links: [
      { url: 'https://example.com', title: 'My Website' },
      { url: 'https://twitter.com', title: 'Twitter' },
      { url: 'https://instagram.com', title: 'Instagram' }
    ],
    theme: {
      textColor: '#1a1a1a',
      background: '#ffffff',
      buttonColor: '#1a1a1a',
      buttonTextColor: '#ffffff'
    },
    profile: {
      bio: 'Digital creator & explorer',
      name: 'Your Name',
      avatar: ''
    }
  },
  component: LinktreeBase
};

export const GradientLinks: TemplateDefinition = {
  id: '22dd00ad-40c2-425e-9801-83af98e3d35d',
  name: 'Gradient Links',
  category: 'linktree',
  description: 'A vibrant gradient link page',
  schema: commonSchema as any,
  defaultData: {
    links: [
      { url: 'https://example.com', title: 'Portfolio' },
      { url: 'https://youtube.com', title: 'YouTube' },
      { url: 'https://shop.example.com', title: 'Shop' }
    ],
    theme: {
      textColor: '#ffffff',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonColor: 'rgba(255,255,255,0.2)',
      buttonTextColor: '#ffffff'
    },
    profile: {
      bio: 'Creative soul ✨',
      name: 'Your Name',
      avatar: ''
    }
  },
  component: LinktreeBase
};

export const NeonGlow: TemplateDefinition = {
  id: '63130804-b376-4595-9ca4-1e593a6160b4',
  name: 'Neon Glow',
  category: 'linktree',
  description: 'A futuristic neon link page',
  schema: {
    sections: [
      ...commonSchema.sections,
      {
        type: 'theme',
        fields: [
          { name: 'background', type: 'color', label: 'Background' },
          { name: 'textColor', type: 'color', label: 'Text Color' },
          { name: 'buttonColor', type: 'color', label: 'Button Color' },
          { name: 'buttonTextColor', type: 'color', label: 'Button Text' },
          { name: 'glowColor', type: 'color', label: 'Glow Color' }
        ]
      }
    ]
  } as any,
  defaultData: {
    links: [
      { url: '', title: 'My Website' },
      { url: '', title: 'Portfolio' }
    ],
    theme: {
      glowColor: '#00ff88',
      textColor: '#00ff88',
      background: '#0a0a0f',
      buttonColor: '#1a1a2e',
      buttonTextColor: '#00ff88'
    },
    profile: {
      bio: 'Welcome to my neon world',
      name: 'Cyber User',
      avatar: ''
    }
  },
  component: LinktreeBase
};

export const Glassmorphism: TemplateDefinition = {
  id: 'a340ac35-637a-4cb0-b09b-d1968f736824',
  name: 'Glassmorphism',
  category: 'linktree',
  description: 'Elegant glass-style link page',
  schema: {
    sections: [
      ...commonSchema.sections,
      {
        type: 'theme',
        fields: [
          { name: 'background', type: 'text', label: 'Background Gradient' },
          { name: 'textColor', type: 'color', label: 'Text Color' },
          { name: 'buttonColor', type: 'color', label: 'Button Color' },
          { name: 'buttonTextColor', type: 'color', label: 'Button Text' }
        ]
      }
    ]
  } as any,
  defaultData: {
    links: [
      { url: '', title: 'Connect' },
      { url: '', title: 'Projects' }
    ],
    theme: {
      textColor: '#ffffff',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonColor: 'rgba(255,255,255,0.15)',
      buttonTextColor: '#ffffff'
    },
    profile: {
      bio: 'Elegant & modern',
      name: 'Glass User',
      avatar: ''
    }
  },
  component: LinktreeBase
};

export const RetroWave: TemplateDefinition = {
  id: '42642365-cc84-4e38-a56f-edb7c1b528cb',
  name: 'Retro Wave',
  category: 'linktree',
  description: '80s inspired retro link page',
  schema: {
    sections: [
      ...commonSchema.sections,
      {
        type: 'theme',
        fields: [
          { name: 'background', type: 'text', label: 'Background' },
          { name: 'textColor', type: 'color', label: 'Text Color' },
          { name: 'buttonColor', type: 'color', label: 'Button Color' },
          { name: 'buttonTextColor', type: 'color', label: 'Button Text' }
        ]
      }
    ]
  } as any,
  defaultData: {
    links: [
      { url: '', title: 'Music' },
      { url: '', title: 'Vibes' }
    ],
    theme: {
      textColor: '#ff6b9d',
      background: 'linear-gradient(180deg, #2d1b69 0%, #11001c 50%, #fc6767 100%)',
      buttonColor: '#ff6b9d',
      buttonTextColor: '#11001c'
    },
    profile: {
      bio: 'Living in the 80s',
      name: 'Retro Star',
      avatar: ''
    }
  },
  component: LinktreeBase
};
