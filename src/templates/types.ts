import { TemplateCategory, TemplateSchema } from '@/types/builder';
import { ComponentType } from 'react';

export interface LocalTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail_url?: string;
  component: ComponentType<any>;
  default_data: Record<string, any>;
  schema?: TemplateSchema; // Optional, can be derived from code or defined here
}

export type TemplateRegistry = Record<string, LocalTemplate>;
