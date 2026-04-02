import { TemplateDefinition } from '../types';
import { LetterBase } from './LetterBase';

const letterSchema = {
  sections: [
    {
      type: 'letter',
      fields: [
        { name: 'title', type: 'text', label: 'Title' },
        { name: 'date', type: 'text', label: 'Date' },
        { name: 'greeting', type: 'text', label: 'Greeting' },
        { name: 'body', type: 'richtext', label: 'Letter Body' },
        { name: 'closing', type: 'text', label: 'Closing' },
        { name: 'signature', type: 'text', label: 'Signature' }
      ]
    }
  ]
};

const documentSchema = {
  sections: [
    {
      type: 'document',
      fields: [
        { name: 'title', type: 'text', label: 'Document Title' },
        { name: 'subtitle', type: 'text', label: 'Subtitle' },
        { name: 'content', type: 'richtext', label: 'Content' },
        { name: 'author', type: 'text', label: 'Author' }
      ]
    }
  ]
};

export const ClassicLetter: TemplateDefinition = {
  id: '7e025846-b69e-465e-9189-311c5522be3b',
  name: 'Classic Letter',
  category: 'letter',
  description: 'A traditional letter format',
  schema: letterSchema as any,
  defaultData: {
    theme: { textColor: '#2d2d2d', background: '#faf7f2', fontFamily: 'serif', accentColor: '#8b7355' },
    letter: {
      body: 'This is where your message goes...',
      date: 'February 2026', title: 'A Letter to You', closing: 'With warm regards,', greeting: 'Dear Reader,', signature: 'Your Name'
    }
  },
  component: LetterBase
};

export const ModernDocument: TemplateDefinition = {
  id: '4c02dcad-7c0f-461c-a316-eed9e8783a8d',
  name: 'Modern Document',
  category: 'letter',
  description: 'Clean and professional document',
  schema: documentSchema as any,
  defaultData: {
    theme: { textColor: '#1a1a1a', background: '#ffffff', fontFamily: 'sans-serif', accentColor: '#2563eb' },
    document: { title: 'My Document', author: 'Your Name', content: 'Start writing...', subtitle: 'A brief description' }
  },
  component: LetterBase
};

export const Typewriter: TemplateDefinition = {
  id: '22a3307f-176e-48a1-9b8d-72d0912a71d9',
  name: 'Typewriter',
  category: 'letter',
  description: 'Retro typewriter style',
  schema: {
    sections: [
      ...letterSchema.sections,
      {
        type: 'theme',
        fields: [
          { name: 'background', type: 'color', label: 'Paper Color' },
          { name: 'textColor', type: 'color', label: 'Ink Color' },
          { name: 'accentColor', type: 'color', label: 'Accent' },
          { name: 'fontFamily', type: 'text', label: 'Font Style' }
        ]
      }
    ]
  } as any,
  defaultData: {
    theme: { textColor: '#2c2c2c', background: '#f4f1ea', fontFamily: 'typewriter', accentColor: '#8b4513' },
    letter: { body: 'Your story begins here...', date: '', title: 'A Letter', closing: 'Yours truly,', greeting: 'Dear Reader,', signature: 'The Author' }
  },
  component: LetterBase
};

export const LoveLetter: TemplateDefinition = {
  id: '6ef8263b-63e2-46a0-9350-dd3dae021f3c',
  name: 'Love Letter',
  category: 'letter',
  description: 'Romantic and expressive',
  schema: {
    sections: [
      ...letterSchema.sections,
      {
        type: 'theme',
        fields: [
          { name: 'background', type: 'color', label: 'Paper Color' },
          { name: 'textColor', type: 'color', label: 'Ink Color' },
          { name: 'accentColor', type: 'color', label: 'Accent' },
          { name: 'fontFamily', type: 'text', label: 'Font Style' }
        ]
      }
    ]
  } as any,
  defaultData: {
    theme: { textColor: '#8b5a5a', background: '#fff5f5', fontFamily: 'cursive', accentColor: '#e89b9b' },
    letter: { body: 'Words cannot express...', date: '', title: 'My Dearest', closing: 'Forever yours,', greeting: 'My Love,', signature: '♥' }
  },
  component: LetterBase
};

export const OfficialDocument: TemplateDefinition = {
  id: '3f2c0228-1917-40b0-82f0-f469324b3774',
  name: 'Official Document',
  category: 'letter',
  description: 'Formal and professional',
  schema: {
    sections: [
      ...documentSchema.sections,
      {
        type: 'theme',
        fields: [
          { name: 'background', type: 'color', label: 'Background' },
          { name: 'textColor', type: 'color', label: 'Text Color' },
          { name: 'accentColor', type: 'color', label: 'Accent' },
          { name: 'fontFamily', type: 'text', label: 'Font Style' }
        ]
      }
    ]
  } as any,
  defaultData: {
    theme: { textColor: '#1a1a1a', background: '#ffffff', fontFamily: 'sans', accentColor: '#003366' },
    document: { title: 'Official Document', author: 'Administrator', content: 'This document contains...', subtitle: 'Confidential' }
  },
  component: LetterBase
};
