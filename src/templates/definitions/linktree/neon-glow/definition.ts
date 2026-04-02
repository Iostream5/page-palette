import Template from './Template';
import { createTemplateDefinition } from '@/templates/types';
import schema from './schema';
import defaultData from './default-data';

const neonGlow = createTemplateDefinition({
  id: 'neon-glow',
  legacyIds: ['63130804-b376-4595-9ca4-1e593a6160b4'],
  name: 'Neon Glow',
  category: 'linktree',
  description: 'A vibrant neon-themed link page with pulsing animations.',
  component: Template,
  schema,
  default_data: defaultData,
});

export default neonGlow;
