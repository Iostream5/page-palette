import { TemplateCategory, TemplateSchema } from '@/types/builder';
import { ComponentType } from 'react';

export type TemplateComponentProps = {
  data: Record<string, unknown>;
};

export type TemplateEditorProps = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export interface LocalTemplate {
  id: string;
  legacyIds?: string[];
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail_url?: string;
  component: ComponentType<TemplateComponentProps>;
  default_data: Record<string, unknown>;
  schema?: TemplateSchema; // Optional, can be derived from code or defined here
  editor?: ComponentType<TemplateEditorProps>;
}

export type TemplateRegistry = Record<string, LocalTemplate>;

export function createTemplateDefinition(template: LocalTemplate): LocalTemplate {
  return template;
}
