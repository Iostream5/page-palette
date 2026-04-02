import { TemplateCategory, TemplateSchema } from '@/types/builder';
import { ComponentType } from 'react';

export interface EditorProps {
  data: any;
  onChange: (data: Record<string, unknown>) => void;
  updateField: (path: string, value: string) => void;
  updateArrayItem: (arrayPath: string, index: number, field: string, value: string) => void;
  addArrayItem: (arrayPath: string, defaultItem: Record<string, any>) => void;
  removeArrayItem: (arrayPath: string, index: number) => void;
}

export interface LocalTemplate {
  id: string;
  slug: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail_url?: string;
  component: ComponentType<any>;
  editor: ComponentType<EditorProps>;
  default_data: Record<string, any>;
  schema?: TemplateSchema;
}

export type TemplateRegistry = Record<string, LocalTemplate>;
