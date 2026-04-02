export type TemplateCategory = 'linktree' | 'gallery' | 'letter' | 'custom';
export type ProjectStatus = 'draft' | 'published';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string | null;
  thumbnail_url: string | null;
  schema: TemplateSchema;
  default_data: Record<string, unknown>;
  created_at: string;
}

export interface TemplateSchema {
  sections: TemplateSection[];
}

export interface TemplateSection {
  type: string;
  fields: TemplateField[];
}

export interface TemplateField {
  name: string;
  type: 'text' | 'textarea' | 'richtext' | 'image' | 'url' | 'color' | 'array';
  label: string;
  itemFields?: TemplateField[];
}

export interface ThemeSettings {
  background?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  glowColor?: string;
  borderRadius?: number;
  shadowIntensity?: number;
  animationSpeed?: number;
  fontFamily?: string;
  fontHeading?: string;
}

export interface BrandKit {
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  fontHeading?: string;
  customCSS?: string;
}

export interface AnimationSettings {
  entranceAnimation?: string;
  hoverAnimation?: string;
  scrollAnimation?: string;
  animationSpeed?: number;
  enableParallax?: boolean;
  enableMicroInteractions?: boolean;
}

export interface Project {
  id: string;
  user_id: string;
  template_id: string;
  category: TemplateCategory;
  name: string;
  data: Record<string, unknown>;
  slug: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  // Resolved from the local template registry using template_id.
  template?: Template;
}

export interface LinkItem {
  title: string;
  url: string;
}

export interface PhotoItem {
  url: string;
  caption: string;
}

export interface LinktreeData {
  profile: {
    avatar: string;
    name: string;
    bio: string;
  };
  links: LinkItem[];
  theme: ThemeSettings;
}

export interface GalleryData {
  header: {
    title: string;
    description: string;
  };
  photos: PhotoItem[];
  theme: ThemeSettings;
}

export interface LetterData {
  letter?: {
    title: string;
    date: string;
    greeting: string;
    body: string;
    closing: string;
    signature: string;
  };
  document?: {
    title: string;
    subtitle: string;
    content: string;
    author: string;
  };
  theme: ThemeSettings;
}

export type ProjectData = LinktreeData | GalleryData | LetterData;

export const CATEGORIES: { id: TemplateCategory; name: string; description: string; icon: string }[] = [
  {
    id: 'custom',
    name: 'Custom Web',
    description: 'Build your own page with drag-and-drop components',
    icon: '🎨',
  },
  {
    id: 'linktree',
    name: 'Link Page',
    description: 'Share all your links in one place',
    icon: '🔗',
  },
  {
    id: 'gallery',
    name: 'Photo Gallery',
    description: 'Showcase your photos beautifully',
    icon: '🖼️',
  },
  {
    id: 'letter',
    name: 'Letter / Document',
    description: 'Share a letter or document',
    icon: '📝',
  },
];
