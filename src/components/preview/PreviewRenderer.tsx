import { Template } from '@/types/builder';
import { getTemplateById } from '@/templates/registry';

interface PreviewRendererProps {
  template: Template;
  data: Record<string, unknown>;
}

export function PreviewRenderer({ template, data }: PreviewRendererProps) {
  // Try to find the local template first by ID (modern way) or by Name (legacy migration support)
  const localTemplate = getTemplateById(template.id);

  if (localTemplate) {
    const Component = localTemplate.component;
    return <Component data={data} />;
  }

  // Fallback if template not found in registry (should not happen for core templates)
  return (
    <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg m-4">
      <div className="text-center">
        <p className="font-medium">Template Not Found</p>
        <p className="text-xs mt-1">ID: {template.id} | Name: {template.name}</p>
        <p className="text-xs">Category: {template.category}</p>
      </div>
    </div>
  );
}
