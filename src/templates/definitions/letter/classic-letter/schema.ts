import { TemplateSchema } from '@/types/builder';

const schema: TemplateSchema = {
  sections: [
    {
      type: 'letter',
      fields: [
        { name: 'title', type: 'text', label: 'Title' },
        { name: 'date', type: 'text', label: 'Date' },
        { name: 'greeting', type: 'text', label: 'Greeting' },
        { name: 'body', type: 'textarea', label: 'Body' },
        { name: 'closing', type: 'text', label: 'Closing' },
        { name: 'signature', type: 'text', label: 'Signature' },
      ],
    },
    {
      type: 'theme',
      fields: [
        { name: 'background', type: 'color', label: 'Background' },
        { name: 'textColor', type: 'color', label: 'Text Color' },
        { name: 'fontFamily', type: 'text', label: 'Font Family' },
      ],
    },
  ],
};

export default schema;
