import { TemplateSchema } from '@/types/builder';

const schema: TemplateSchema = {
  sections: [
    {
      type: 'header',
      fields: [
        { name: 'title', type: 'text', label: 'Gallery Title' },
        { name: 'description', type: 'textarea', label: 'Description' },
      ],
    },
    {
      type: 'photos',
      fields: [
        {
          name: 'photos',
          type: 'array',
          label: 'Photos',
          itemFields: [
            { name: 'url', type: 'image', label: 'Image URL' },
            { name: 'caption', type: 'text', label: 'Caption' },
          ],
        },
      ],
    },
    {
      type: 'theme',
      fields: [
        { name: 'background', type: 'color', label: 'Background' },
        { name: 'textColor', type: 'color', label: 'Text Color' },
        { name: 'accentColor', type: 'color', label: 'Accent Color' },
      ],
    },
  ],
};

export default schema;
