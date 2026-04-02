import { TemplateDefinition } from '../types';
import { GalleryBase } from './GalleryBase';

const commonSchema = {
  sections: [
    {
      type: 'header',
      fields: [
        { name: 'title', type: 'text', label: 'Gallery Title' },
        { name: 'description', type: 'textarea', label: 'Description' }
      ]
    },
    {
      type: 'photos',
      fields: [
        {
          name: 'photos',
          type: 'array',
          label: 'Photos',
          itemFields: [
            { name: 'url', type: 'image', label: 'Image URL' },
            { name: 'caption', type: 'text', label: 'Caption' }
          ]
        }
      ]
    }
  ]
};

export const GridGallery: TemplateDefinition = {
  id: '5ec04c82-dc19-4c31-bbca-eb368c446cb2',
  name: 'Grid Gallery',
  category: 'gallery',
  description: 'A clean photo grid layout',
  schema: commonSchema as any,
  defaultData: {
    theme: { textColor: '#1a1a1a', background: '#f8f9fa', accentColor: '#3b82f6' },
    header: { title: 'My Photo Gallery', description: 'A collection of my favorite moments' },
    photos: [{ url: '', caption: 'Photo 1' }, { url: '', caption: 'Photo 2' }, { url: '', caption: 'Photo 3' }]
  },
  component: GalleryBase
};

export const MasonryGallery: TemplateDefinition = {
  id: '6c086b2b-9a45-4f5a-828a-9bb29b6a1bf8',
  name: 'Masonry Gallery',
  category: 'gallery',
  description: 'Pinterest-style masonry layout',
  schema: commonSchema as any,
  defaultData: {
    theme: { textColor: '#ffffff', background: '#1a1a1a', accentColor: '#f59e0b' },
    header: { title: 'Portfolio', description: 'My creative work' },
    photos: [{ url: '', caption: 'Work 1' }, { url: '', caption: 'Work 2' }, { url: '', caption: 'Work 3' }]
  },
  component: GalleryBase
};

export const MasonryDark: TemplateDefinition = {
  id: '205aeef9-55e5-4e65-8962-41aa88f24ad3',
  name: 'Masonry Dark',
  category: 'gallery',
  description: 'A moody collection',
  schema: {
    sections: [
      ...commonSchema.sections,
      {
        type: 'theme',
        fields: [
          { name: 'background', type: 'color', label: 'Background' },
          { name: 'textColor', type: 'color', label: 'Text Color' },
          { name: 'accentColor', type: 'color', label: 'Accent Color' }
        ]
      }
    ]
  } as any,
  defaultData: {
    theme: { textColor: '#e0e0e0', background: '#0d0d0d', accentColor: '#ff4444' },
    header: { title: 'Dark Gallery', description: 'A moody collection' },
    photos: [{ url: '', caption: 'Photo 1' }, { url: '', caption: 'Photo 2' }, { url: '', caption: 'Photo 3' }]
  },
  component: GalleryBase
};

export const PolaroidStack: TemplateDefinition = {
  id: 'be7bb547-7f8c-4c4a-b179-5d4e544ac5bf',
  name: 'Polaroid Stack',
  category: 'gallery',
  description: 'Captured moments',
  schema: {
    sections: [
      ...commonSchema.sections,
      {
        type: 'theme',
        fields: [
          { name: 'background', type: 'color', label: 'Background' },
          { name: 'textColor', type: 'color', label: 'Text Color' },
          { name: 'accentColor', type: 'color', label: 'Accent Color' }
        ]
      }
    ]
  } as any,
  defaultData: {
    theme: { textColor: '#2d2d2d', background: '#f5f0e8', accentColor: '#d4a574' },
    header: { title: 'Memories', description: 'Captured moments' },
    photos: [{ url: '', caption: 'Memory 1' }, { url: '', caption: 'Memory 2' }, { url: '', caption: 'Memory 3' }]
  },
  component: GalleryBase
};

export const FilmStrip: TemplateDefinition = {
  id: '1fbf479a-e646-4184-b6a4-2bfcb76d627b',
  name: 'Film Strip',
  category: 'gallery',
  description: '35mm memories',
  schema: {
    sections: [
      ...commonSchema.sections,
      {
        type: 'theme',
        fields: [
          { name: 'background', type: 'color', label: 'Background' },
          { name: 'textColor', type: 'color', label: 'Text Color' },
          { name: 'accentColor', type: 'color', label: 'Accent Color' }
        ]
      }
    ]
  } as any,
  defaultData: {
    theme: { textColor: '#f0f0f0', background: '#1a1a1a', accentColor: '#ffd700' },
    header: { title: 'Film Roll', description: '35mm memories' },
    photos: [{ url: '', caption: 'Frame 1' }, { url: '', caption: 'Frame 2' }, { url: '', caption: 'Frame 3' }]
  },
  component: GalleryBase
};
