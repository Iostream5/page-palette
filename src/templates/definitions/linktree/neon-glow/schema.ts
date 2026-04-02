import { TemplateSchema } from '@/types/builder';

const schema: TemplateSchema = {
  sections: [
    {
      type: 'profile',
      fields: [
        { name: 'avatar', type: 'image', label: 'Avatar URL' },
        { name: 'name', type: 'text', label: 'Name' },
        { name: 'bio', type: 'textarea', label: 'Bio' },
      ],
    },
    {
      type: 'links',
      fields: [
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          itemFields: [
            { name: 'title', type: 'text', label: 'Title' },
            { name: 'url', type: 'url', label: 'URL' },
          ],
        },
      ],
    },
    {
      type: 'theme',
      fields: [
        { name: 'background', type: 'text', label: 'Background' },
        { name: 'textColor', type: 'color', label: 'Text Color' },
        { name: 'buttonColor', type: 'color', label: 'Button Color' },
        { name: 'buttonTextColor', type: 'color', label: 'Button Text Color' },
      ],
    },
  ],
};

export default schema;
