import { useState } from 'react';
import { Template, LinktreeData, GalleryData, LetterData, BrandKit, AnimationSettings } from '@/types/builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, AlertCircle, Palette, Wand2, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeControls } from './ThemeControls';
import { BrandKitControls } from './BrandKitControls';
import { AnimationSelector, AnimationSpeedControl } from './AnimationSelector';
interface EditorFormProps {
  template: Template;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

// Sanitize text input to prevent XSS
function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Validate image URL
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

  const updateField = (path: string, value: string) => {
    const keys = path.split('.');
    const newData = { ...data };
    let current: Record<string, unknown> = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
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
      setImageErrors((prev) => ({ ...prev, [path]: validation.error! }));
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
    const arr = (getNestedValue(data, arrayPath) as unknown[]) || [];
    const newArr = [...arr];
    if (!newArr[index]) newArr[index] = {};
    (newArr[index] as Record<string, unknown>)[field] = value;
    updateField(arrayPath, newArr as unknown as string);
  };

  const addArrayItem = (arrayPath: string, defaultItem: Record<string, string>) => {
    const arr = (getNestedValue(data, arrayPath) as unknown[]) || [];
    updateField(arrayPath, [...arr, defaultItem] as unknown as string);
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    const arr = (getNestedValue(data, arrayPath) as unknown[]) || [];
    updateField(
      arrayPath,
      arr.filter((_, i) => i !== index) as unknown as string
    );
  };

  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((current, key) => {
      return (current as Record<string, unknown>)?.[key];
    }, obj as unknown);
  };

  // Render based on template category
  if (template.category === 'linktree') {
    return (
      <LinktreeEditor
        data={data as unknown as LinktreeData}
        onChange={onChange}
        imageErrors={imageErrors}
        updateField={updateField}
        updateImageField={updateImageField}
        updateArrayItem={updateArrayItem}
        addArrayItem={addArrayItem}
        removeArrayItem={removeArrayItem}
      />
    );
  }

  if (template.category === 'gallery') {
    return (
      <GalleryEditor
        data={data as unknown as GalleryData}
        onChange={onChange}
        imageErrors={imageErrors}
        updateField={updateField}
        updateImageField={updateImageField}
        updateArrayItem={updateArrayItem}
        addArrayItem={addArrayItem}
        removeArrayItem={removeArrayItem}
      />
    );
  }

  if (template.category === 'letter') {
    return (
      <LetterEditor
        data={data as unknown as LetterData}
        updateField={updateField}
      />
    );
  }

  return null;
}

interface LinktreeEditorProps {
  data: LinktreeData;
  onChange: (data: Record<string, unknown>) => void;
  imageErrors: Record<string, string>;
  updateField: (path: string, value: string) => void;
  updateImageField: (path: string, value: string) => void;
  updateArrayItem: (arrayPath: string, index: number, field: string, value: string) => void;
  addArrayItem: (arrayPath: string, defaultItem: Record<string, string>) => void;
  removeArrayItem: (arrayPath: string, index: number) => void;
}

function LinktreeEditor({
  data,
  imageErrors,
  updateField,
  updateImageField,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: LinktreeEditorProps) {
  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Avatar URL</Label>
            <Input
              value={data.profile?.avatar || ''}
              onChange={(e) => updateImageField('profile.avatar', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            {imageErrors['profile.avatar'] && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {imageErrors['profile.avatar']}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={data.profile?.name || ''}
              onChange={(e) => updateField('profile.name', e.target.value)}
              placeholder="Your name"
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={data.profile?.bio || ''}
              onChange={(e) => updateField('profile.bio', e.target.value)}
              placeholder="A short bio about you"
              maxLength={150}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Links Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.links || []).map((link, index) => (
            <div
              key={index}
              className="flex items-start gap-2 rounded-lg border border-border p-3"
            >
              <div className="flex-1 space-y-2">
                <Input
                  value={link.title}
                  onChange={(e) => updateArrayItem('links', index, 'title', e.target.value)}
                  placeholder="Link title"
                  maxLength={50}
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateArrayItem('links', index, 'url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('links', index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('links', { title: '', url: '' })}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </CardContent>
      </Card>

      {/* Customization Tabs */}
      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="theme" className="text-xs gap-1">
            <Palette className="h-3 w-3" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="animations" className="text-xs gap-1">
            <Wand2 className="h-3 w-3" />
            Animate
          </TabsTrigger>
          <TabsTrigger value="brand" className="text-xs gap-1">
            <Settings2 className="h-3 w-3" />
            Brand
          </TabsTrigger>
        </TabsList>
        <TabsContent value="theme" className="mt-4">
          <ThemeControls
            theme={data.theme || {}}
            updateField={updateField}
            category="linktree"
          />
        </TabsContent>
        <TabsContent value="animations" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Animation Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimationSelector
                value={(data as unknown as Record<string, unknown>).animations as string[] || []}
                onChange={(animations) => updateField('animations', animations as unknown as string)}
                maxSelections={3}
              />
              <AnimationSpeedControl
                value={data.theme?.animationSpeed || 1}
                onChange={(speed) => updateField('theme.animationSpeed', speed.toString())}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="brand" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Brand Kit</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandKitControls
                brandKit={(data as unknown as Record<string, unknown>).brandKit as BrandKit || {}}
                onChange={(brandKit) => updateField('brandKit', brandKit as unknown as string)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface GalleryEditorProps {
  data: GalleryData;
  onChange: (data: Record<string, unknown>) => void;
  imageErrors: Record<string, string>;
  updateField: (path: string, value: string) => void;
  updateImageField: (path: string, value: string) => void;
  updateArrayItem: (arrayPath: string, index: number, field: string, value: string) => void;
  addArrayItem: (arrayPath: string, defaultItem: Record<string, string>) => void;
  removeArrayItem: (arrayPath: string, index: number) => void;
}

function GalleryEditor({
  data,
  imageErrors,
  updateField,
  updateImageField,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: GalleryEditorProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={data.header?.title || ''}
              onChange={(e) => updateField('header.title', e.target.value)}
              placeholder="Gallery Title"
              maxLength={60}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={data.header?.description || ''}
              onChange={(e) => updateField('header.description', e.target.value)}
              placeholder="A short description"
              maxLength={150}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photos Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.photos || []).map((photo, index) => (
            <div
              key={index}
              className="flex items-start gap-2 rounded-lg border border-border p-3"
            >
              <div className="flex-1 space-y-2">
                <Input
                  value={photo.url}
                  onChange={(e) => updateArrayItem('photos', index, 'url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {photo.url && (
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="h-20 w-full rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <Input
                  value={photo.caption}
                  onChange={(e) => updateArrayItem('photos', index, 'caption', e.target.value)}
                  placeholder="Caption"
                  maxLength={100}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('photos', index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('photos', { url: '', caption: '' })}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Photo
          </Button>
        </CardContent>
      </Card>

      {/* Theme Controls */}
      <ThemeControls
        theme={data.theme || {}}
        updateField={updateField}
        category="gallery"
      />
    </div>
  );
}

interface LetterEditorProps {
  data: LetterData;
  updateField: (path: string, value: string) => void;
}


function LetterEditor({ data, updateField }: LetterEditorProps) {
  if (data.letter) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Letter Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={data.letter?.title || ''}
                onChange={(e) => updateField('letter.title', e.target.value)}
                placeholder="Letter title"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                value={data.letter?.date || ''}
                onChange={(e) => updateField('letter.date', e.target.value)}
                placeholder="February 2026"
              />
            </div>
            <div className="space-y-2">
              <Label>Greeting</Label>
              <Input
                value={data.letter?.greeting || ''}
                onChange={(e) => updateField('letter.greeting', e.target.value)}
                placeholder="Dear Reader,"
              />
            </div>
            <div className="space-y-2">
              <Label>Body</Label>
              <Textarea
                value={data.letter?.body || ''}
                onChange={(e) => updateField('letter.body', e.target.value)}
                placeholder="Write your letter..."
                rows={8}
              />
            </div>
            <div className="space-y-2">
              <Label>Closing</Label>
              <Input
                value={data.letter?.closing || ''}
                onChange={(e) => updateField('letter.closing', e.target.value)}
                placeholder="With warm regards,"
              />
            </div>
            <div className="space-y-2">
              <Label>Signature</Label>
              <Input
                value={data.letter?.signature || ''}
                onChange={(e) => updateField('letter.signature', e.target.value)}
                placeholder="Your Name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Controls */}
        <ThemeControls
          theme={data.theme || {}}
          updateField={updateField}
          category="letter"
        />
      </div>
    );
  }

  if (data.document) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Document Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={data.document?.title || ''}
                onChange={(e) => updateField('document.title', e.target.value)}
                placeholder="Document title"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={data.document?.subtitle || ''}
                onChange={(e) => updateField('document.subtitle', e.target.value)}
                placeholder="A brief description"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={data.document?.content || ''}
                onChange={(e) => updateField('document.content', e.target.value)}
                placeholder="Write your content..."
                rows={10}
              />
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input
                value={data.document?.author || ''}
                onChange={(e) => updateField('document.author', e.target.value)}
                placeholder="Your Name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Controls */}
        <ThemeControls
          theme={data.theme || {}}
          updateField={updateField}
          category="letter"
        />
      </div>
    );
  }

  return null;
}
