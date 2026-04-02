import Template from './Template';
import { createTemplateDefinition } from '@/templates/types';
import schema from './schema';
import defaultData from './default-data';
import Editor from './Editor';

const retroWave = createTemplateDefinition({
  id: 'retro-wave',
  legacyIds: ['42642365-cc84-4e38-a56f-edb7c1b528cb'],
  name: 'Retro Wave',
  category: 'linktree',
  description: '80s inspired retro aesthetic with synthwave vibes.',
  component: Template,
  editor: Editor,
  schema,
  default_data: defaultData,
});

export default retroWave;
