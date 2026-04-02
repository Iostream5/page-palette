import Template from './Template';
import { createTemplateDefinition } from '@/templates/types';
import schema from './schema';
import defaultData from './default-data';

const classicLetter = createTemplateDefinition({
  id: 'classic-letter',
  legacyIds: ['7e025846-b69e-465e-9189-311c5522be3b'],
  name: 'Classic Letter',
  category: 'letter',
  description: 'A timeless letter layout with elegant typography.',
  component: Template,
  schema,
  default_data: defaultData,
});

export default classicLetter;
