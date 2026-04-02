import { useMemo, useState } from 'react';
import { Template, LinktreeData, GalleryData, LetterData, BrandKit, TemplateField, TemplateSection, TemplateCategory } from '@/types/builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, AlertCircle, Palette, Wand2, Settings2 } from 'lucide-react';
import { ThemeControls } from './ThemeControls';
import { BrandKitControls } from './BrandKitControls';
import { AnimationSelector, AnimationSpeedControl } from './AnimationSelector';
import { getTemplateById } from '@/templates/registry';

interface EditorFormProps {
  template: Template;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

interface TemplateEditorHelpers {
  imageErrors: Record<string, string>;
  getNestedValue: (path: string) => unknown;
  updateField: (path: string, value: unknown) => void;
  updateImageField: (path: string, value: string) => void;
  updateArrayItem: (arrayPath: string, index: number, field: string, value: string) => void;
  addArrayItem: (arrayPath: string, defaultItem: Record<string, string>) => void;
  removeArrayItem: (arrayPath: string, index: number) => void;
}

function validateImageUrl(url: string): { valid: boolean; error?: string } {
  if (!url) return { valid: true };

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL must use HTTPS' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

export function EditorForm({ template, data, onChange }: EditorFormProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({});
  const localTemplate = useMemo(() => getTemplateById(template.id), [template.id]);

  if (localTemplate?.editor) {
    const CustomEditor = localTemplate.editor;
    return <CustomEditor data={data} onChange={onChange} />;
  }

  const getNestedValue = (path: string): unknown => {
    return path.split('.').reduce((current, key) => {
      return (current as Record<string, unknown>)?.[key];
    }, data as unknown);
  };

  const updateField = (path: string, value: unknown) => {
    const keys = path.split('.');
    const newData = { ...data };
    let current: Record<string, unknown> = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      const next = current[keys[i]];
      if (!next || typeof next !== 'object' || Array.isArray(next)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;
    onChange(newData);
  };

  const updateImageField = (path: string, value: string) => {
    const validation = validateImageUrl(value);
    if (!validation.valid) {
      setImageErrors((prev) => ({ ...prev, [path]: validation.error || 'Invalid image URL' }));
    } else {
      setImageErrors((prev) => {
        const next = { ...prev };
        delete next[path];
        return next;
      });
    }
    updateField(path, value);
  };

  const updateArrayItem = (
    arrayPath: string,
    index: number,
    field: string,
    value: string
  ) => {
    const arr = (getNestedValue(arrayPath) as unknown[]) || [];
    const newArr = [...arr];
    if (!newArr[index]) newArr[index] = {};
    (newArr[index] as Record<string, unknown>)[field] = value;
    updateField(arrayPath, newArr);
  };

  const addArrayItem = (arrayPath: string, defaultItem: Record<string, string>) => {
    const arr = (getNestedValue(arrayPath) as unknown[]) || [];
    updateField(arrayPath, [...arr, defaultItem]);
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    const arr = (getNestedValue(arrayPath) as unknown[]) || [];
    updateField(
      arrayPath,
      arr.filter((_, i) => i !== index)
    );
  };

  const helpers: TemplateEditorHelpers = {
    imageErrors,
    getNestedValue,
    updateField,
    updateImageField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
  };

  if (localTemplate?.schema?.sections?.length) {
    return (
      <TemplateSchemaEditor
        template={template}
        data={data}
        sections={localTemplate.schema.sections}
        helpers={helpers}
      />
    );
  }

  if (template.category === 'linktree') {
    return <LinktreeEditor data={data as LinktreeData} helpers={helpers} />;
  }

  if (template.category === 'gallery') {
    return <GalleryEditor data={data as GalleryData} helpers={helpers} />;
  }

  if (template.category === 'letter') {
    return <LetterEditor data={data as LetterData} helpers={helpers} />;
  }

  return null;
}

interface TemplateSchemaEditorProps {
  template: Template;
  data: Record<string, unknown>;
  sections: TemplateSection[];
  helpers: TemplateEditorHelpers;
}

function TemplateSchemaEditor({ template, data, sections, helpers }: TemplateSchemaEditorProps) {
  const theme = (data.theme as Record<string, unknown>) || {};
  const animations = (data.animations as string[]) || [];
  const brandKit = (data.brandKit as BrandKit) || {};
  const hasTheme = sections.some((section) => section.type === 'theme');
  const hasBrandKit = template.category === 'linktree' || template.category === 'custom';
  const hasAnimations = template.category === 'linktree';

  return (
    <div className="space-y-6">
      {sections
        .filter((section) => section.type !== 'theme')
        .map((section) => (
          <Card key={section.type}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{formatSectionTitle(section.type)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.fields.map((field) => (
                <TemplateFieldEditor
                  key={`${section.type}.${field.name}`}
                  field={field}
                  basePath={resolveFieldBasePath(section, field)}
                  helpers={helpers}
                />
              ))}
            </CardContent>
          </Card>
        ))}

      {(hasTheme || hasAnimations || hasBrandKit) && (
        <Tabs defaultValue={hasTheme ? 'theme' : hasAnimations ? 'animations' : 'brand'} className="w-full">
          <TabsList className={`w-full grid ${getTabGridClass(hasTheme, hasAnimations, hasBrandKit)}`}>
            {hasTheme && (
              <TabsTrigger value="theme" className="text-xs gap-1">
                <Palette className="h-3 w-3" />
                Theme
              </TabsTrigger>
            )}
            {hasAnimations && (
              <TabsTrigger value="animations" className="text-xs gap-1">
                <Wand2 className="h-3 w-3" />
                Animate
              </TabsTrigger>
            )}
            {hasBrandKit && (
              <TabsTrigger value="brand" className="text-xs gap-1">
                <Settings2 className="h-3 w-3" />
                Brand
              </TabsTrigger>
            )}
          </TabsList>

          {hasTheme && (
            <TabsContent value="theme" className="mt-4">
              <ThemeControls
                theme={theme}
                updateField={(path, value) => helpers.updateField(path, value)}
                category={template.category as Exclude<TemplateCategory, 'custom'>}
              />
            </TabsContent>
          )}

          {hasAnimations && (
            <TabsContent value="animations" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Animation Effects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimationSelector
                    value={animations}
                    onChange={(nextAnimations) => helpers.updateField('animations', nextAnimations)}
                    maxSelections={3}
                  />
                  <AnimationSpeedControl
                    value={typeof theme.animationSpeed === 'number' ? theme.animationSpeed : 1}
                    onChange={(speed) => helpers.updateField('theme.animationSpeed', speed)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {hasBrandKit && (
            <TabsContent value="brand" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Brand Kit</CardTitle>
                </CardHeader>
                <CardContent>
                  <BrandKitControls
                    brandKit={brandKit}
                    onChange={(nextBrandKit) => helpers.updateField('brandKit', nextBrandKit)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}

interface TemplateFieldEditorProps {
  field: TemplateField;
  basePath: string;
  helpers: TemplateEditorHelpers;
}

function TemplateFieldEditor({ field, basePath, helpers }: TemplateFieldEditorProps) {
  const currentValue = helpers.getNestedValue(basePath);

  if (field.type === 'array') {
    const items = (currentValue as Record<string, string>[]) || [];
    const defaultItem = (field.itemFields || []).reduce<Record<string, string>>((acc, itemField) => {
      acc[itemField.name] = '';
      return acc;
    }, {});

    return (
      <div className="space-y-3">
        <Label>{field.label}</Label>
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-border p-3 space-y-2">
            {(field.itemFields || []).map((itemField) => (
              <div key={itemField.name} className="space-y-2">
                <Label className="text-xs text-muted-foreground">{itemField.label}</Label>
                <FieldInput
                  field={itemField}
                  value={item[itemField.name] || ''}
                  path={`${basePath}.${index}.${itemField.name}`}
                  helpers={helpers}
                  onChange={(value) => helpers.updateArrayItem(basePath, index, itemField.name, value)}
                />
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => helpers.removeArrayItem(basePath, index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Item
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => helpers.addArrayItem(basePath, defaultItem)}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{field.label}</Label>
      <FieldInput
        field={field}
        value={typeof currentValue === 'string' ? currentValue : ''}
        path={basePath}
        helpers={helpers}
        onChange={(value) => {
          if (field.type === 'image') {
            helpers.updateImageField(basePath, value);
            return;
          }
          helpers.updateField(basePath, value);
        }}
      />
      {helpers.imageErrors[basePath] && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {helpers.imageErrors[basePath]}
        </p>
      )}
    </div>
  );
}

interface FieldInputProps {
  field: TemplateField;
  value: string;
  path: string;
  helpers: TemplateEditorHelpers;
  onChange: (value: string) => void;
}

function FieldInput({ field, value, path, helpers, onChange }: FieldInputProps) {
  if (field.type === 'textarea' || field.type === 'richtext') {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.label}
        rows={field.type === 'richtext' ? 6 : 3}
      />
    );
  }

  if (field.type === 'color') {
    return (
      <div className="flex gap-2">
        <Input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 p-1"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
        />
      </div>
    );
  }

  if (field.type === 'image') {
    return (
      <div className="space-y-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        {value && !helpers.imageErrors[path] && (
          <img
            src={value}
            alt={field.label}
            className="h-20 w-full rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>
    );
  }

  return (
    <Input
      type={field.type === 'url' ? 'url' : 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.label}
    />
  );
}

function resolveFieldBasePath(section: TemplateSection, field: TemplateField) {
  if (section.type === 'theme') {
    return `theme.${field.name}`;
  }

  if (field.type === 'array') {
    return field.name;
  }

  return `${section.type}.${field.name}`;
}

function formatSectionTitle(sectionType: string) {
  return sectionType
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getTabGridClass(hasTheme: boolean, hasAnimations: boolean, hasBrandKit: boolean) {
  const count = [hasTheme, hasAnimations, hasBrandKit].filter(Boolean).length;
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  return 'grid-cols-3';
}

interface CategoryEditorProps<T> {
  data: T;
  helpers: TemplateEditorHelpers;
}

function LinktreeEditor({ data, helpers }: CategoryEditorProps<LinktreeData>) {
  return (
    <TemplateSchemaEditor
      template={{
        id: 'fallback-linktree',
        name: 'Linktree',
        category: 'linktree',
        description: null,
        thumbnail_url: null,
        schema: {
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
          ],
        },
        default_data: data as Record<string, unknown>,
        created_at: '',
      }}
      data={data as unknown as Record<string, unknown>}
      sections={[
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
      ]}
      helpers={helpers}
    />
  );
}

function GalleryEditor({ data, helpers }: CategoryEditorProps<GalleryData>) {
  return (
    <TemplateSchemaEditor
      template={{
        id: 'fallback-gallery',
        name: 'Gallery',
        category: 'gallery',
        description: null,
        thumbnail_url: null,
        schema: {
          sections: [
            {
              type: 'header',
              fields: [
                { name: 'title', type: 'text', label: 'Title' },
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
          ],
        },
        default_data: data as Record<string, unknown>,
        created_at: '',
      }}
      data={data as unknown as Record<string, unknown>}
      sections={[
        {
          type: 'header',
          fields: [
            { name: 'title', type: 'text', label: 'Title' },
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
      ]}
      helpers={helpers}
    />
  );
}

function LetterEditor({ data, helpers }: CategoryEditorProps<LetterData>) {
  const sections: TemplateSection[] = data.letter
    ? [
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
      ]
    : [
        {
          type: 'document',
          fields: [
            { name: 'title', type: 'text', label: 'Title' },
            { name: 'subtitle', type: 'text', label: 'Subtitle' },
            { name: 'content', type: 'textarea', label: 'Content' },
            { name: 'author', type: 'text', label: 'Author' },
          ],
        },
      ];

  return (
    <TemplateSchemaEditor
      template={{
        id: 'fallback-letter',
        name: 'Letter',
        category: 'letter',
        description: null,
        thumbnail_url: null,
        schema: { sections },
        default_data: data as Record<string, unknown>,
        created_at: '',
      }}
      data={data as unknown as Record<string, unknown>}
      sections={sections}
      helpers={helpers}
    />
  );
}
