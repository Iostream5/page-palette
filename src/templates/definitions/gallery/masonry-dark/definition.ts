import Template from './Template';
import { createTemplateDefinition } from '@/templates/types';
import schema from './schema';
import defaultData from './default-data';

const masonryDark = createTemplateDefinition({
  id: 'masonry-dark',
  legacyIds: ['205aeef9-55e5-4e65-8962-41aa88f24ad3'],
  name: 'Masonry Dark',
  category: 'gallery',
  description: 'A professional dark-themed photo gallery with masonry layout.',
  component: Template,
  schema,
  default_data: defaultData,
});

export default masonryDark;
