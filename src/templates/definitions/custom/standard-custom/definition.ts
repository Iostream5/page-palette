import Template from './Template';
import { createTemplateDefinition } from '@/templates/types';
import schema from './schema';
import defaultData from './default-data';

const standardCustom = createTemplateDefinition({
  id: 'standard-custom',
  name: 'Standard Custom',
  category: 'custom',
  description: 'The standard custom builder template.',
  component: Template,
  schema,
  default_data: defaultData,
});

export default standardCustom;
