import { Template, LinktreeData, GalleryData, LetterData, BrandKit } from '@/types/builder';
import { LinktreePreview } from './LinktreePreview';
import { GalleryPreview } from './GalleryPreview';
import { LetterPreview } from './LetterPreview';
import { PageComponent } from '@/types/page-components';
import { ComponentRenderer } from '@/components/editor/ComponentRenderer';

interface PreviewRendererProps {
  template: Template;
  data: Record<string, unknown>;
}

export function PreviewRenderer({ template, data }: PreviewRendererProps) {
  // Custom projects render page components
  if (template.category === 'custom') {
    const pageComponents = (data.pageComponents as PageComponent[]) || [];
    const brandKit = data.brandKit as BrandKit;

    return (
      <div className="min-h-full bg-background">
        {brandKit && (
          <style>
            {`
              :root {
                ${brandKit.primaryColor ? `--primary: ${brandKit.primaryColor};` : ''}
                ${brandKit.secondaryColor ? `--secondary: ${brandKit.secondaryColor};` : ''}
                ${brandKit.accentColor ? `--accent: ${brandKit.accentColor};` : ''}
                ${brandKit.fontFamily ? `--font-body: ${brandKit.fontFamily};` : ''}
              }
              .custom-builder-content {
                ${brandKit.fontFamily ? `font-family: ${brandKit.fontFamily};` : ''}
              }
              ${brandKit.customCSS || ''}
            `}
          </style>
        )}
        <div className="custom-builder-content">
          {pageComponents
            .filter(c => c.visible)
            .sort((a, b) => a.order - b.order)
            .map(component => (
              <ComponentRenderer
                key={component.id}
                component={component}
                isEditing={false}
                isSelected={false}
              />
            ))}
          {pageComponents.length === 0 && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No components added yet
            </div>
          )}
        </div>
      </div>
    );
  }

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
