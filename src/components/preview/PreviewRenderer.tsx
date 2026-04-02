import { Template, BrandKit } from '@/types/builder';
import { PageComponent } from '@/types/page-components';
import { ComponentRenderer } from '@/components/editor/ComponentRenderer';
import { getTemplateDefinition } from '@/templates/registry';

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
            .filter(c => c.visible && !pageComponents.some(p => (p.props as any).children?.includes(c.id)))
            .sort((a, b) => a.order - b.order)
            .map(component => (
              <ComponentRenderer
                key={component.id}
                component={component}
                allComponents={pageComponents}
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

  // Use code-based template definition if available
  const templateDef = getTemplateDefinition(template.id);
  if (templateDef) {
    const TemplateComponent = templateDef.component;
    return <TemplateComponent data={data} templateName={template.name} />;
  }

  return null;
}
