import { Template } from '@/types/builder';
import { getTemplateById } from '@/templates/registry';
import { useCallback } from 'react';

interface EditorFormProps {
  template: Template;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function EditorForm({ template, data, onChange }: EditorFormProps) {
  const updateField = useCallback((path: string, value: string) => {
    const newData = { ...data };
    const parts = path.split('.');
    let current: any = newData;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    onChange(newData);
  }, [data, onChange]);

  const updateArrayItem = useCallback((arrayPath: string, index: number, field: string, value: string) => {
    const newData = { ...data };
    const array = (newData[arrayPath] as any[]) || [];
    if (array[index]) {
      array[index] = { ...array[index], [field]: value };
    }
    newData[arrayPath] = array;
    onChange(newData);
  }, [data, onChange]);

  const addArrayItem = useCallback((arrayPath: string, defaultItem: Record<string, any>) => {
    const newData = { ...data };
    const array = (newData[arrayPath] as any[]) || [];
    newData[arrayPath] = [...array, defaultItem];
    onChange(newData);
  }, [data, onChange]);

  const removeArrayItem = useCallback((arrayPath: string, index: number) => {
    const newData = { ...data };
    const array = (newData[arrayPath] as any[]) || [];
    newData[arrayPath] = array.filter((_, i) => i !== index);
    onChange(newData);
  }, [data, onChange]);

  const localTemplate = getTemplateById(template.id);

  if (localTemplate && localTemplate.editor) {
    const Editor = localTemplate.editor;
    return (
      <Editor
        data={data}
        onChange={onChange}
        updateField={updateField}
        updateArrayItem={updateArrayItem}
        addArrayItem={addArrayItem}
        removeArrayItem={removeArrayItem}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
      <p className="font-medium">Editor Not Available</p>
      <p className="text-xs mt-1">ID: {template.id}</p>
    </div>
  );
}
