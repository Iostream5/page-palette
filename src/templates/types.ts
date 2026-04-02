import { TemplateSchema, TemplateCategory } from '@/types/builder';
import { ReactNode } from 'react';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  schema: TemplateSchema;
  defaultData: Record<string, any>;
  component: (props: { data: any; templateName: string }) => ReactNode;
}
