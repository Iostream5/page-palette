import { PageComponent, BrandKit } from '@/types/page-components';
import { ComponentRenderer } from '@/components/editor/ComponentRenderer';
import { EditorProps } from '../../types';

interface StandardCustomProps {
  data: {
    pageComponents?: PageComponent[];
    brandKit?: BrandKit;
  };
}

export default function StandardCustom({ data }: StandardCustomProps) {
  const pageComponents = data.pageComponents || [];
  const brandKit = data.brandKit;

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

export function StandardCustomEditor({}: EditorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-center p-4">
      <p>Custom builder uses the drag-and-drop canvas.</p>
      <p className="text-xs mt-2">Use the Library and Layers panels to manage components.</p>
    </div>
  );
}
