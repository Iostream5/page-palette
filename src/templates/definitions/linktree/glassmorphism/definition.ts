import Template from './Template';
import { createTemplateDefinition } from '@/templates/types';
import schema from './schema';
import defaultData from './default-data';

const glassmorphism = createTemplateDefinition({
  id: 'glassmorphism',
  legacyIds: ['a340ac35-637a-4cb0-b09b-d1968f736824'],
  name: 'Glassmorphism',
  category: 'linktree',
  description: 'Modern glass-style UI with soft blur and gradients.',
  component: Template,
  schema,
  default_data: defaultData,
});

export default glassmorphism;
