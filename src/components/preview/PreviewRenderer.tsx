 import { Template, LinktreeData, GalleryData, LetterData } from '@/types/builder';
 import { LinktreePreview } from './LinktreePreview';
 import { GalleryPreview } from './GalleryPreview';
 import { LetterPreview } from './LetterPreview';

interface PreviewRendererProps {
  template: Template;
  data: Record<string, unknown>;
}

export function PreviewRenderer({ template, data }: PreviewRendererProps) {
  if (template.category === 'linktree') {
     return <LinktreePreview data={data as unknown as LinktreeData} templateName={template.name} />;
  }

  if (template.category === 'gallery') {
     return <GalleryPreview data={data as unknown as GalleryData} templateName={template.name} />;
  }

  if (template.category === 'letter') {
     return <LetterPreview data={data as unknown as LetterData} templateName={template.name} />;
  }

  return null;
}
