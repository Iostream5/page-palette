import { LinktreeData } from '@/types/builder';
import { TemplateEditorProps } from '@/templates/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Sparkles } from 'lucide-react';

function updateNestedField(
  data: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split('.');
  const nextData = { ...data };
  let current: Record<string, unknown> = nextData;

  for (let i = 0; i < keys.length - 1; i++) {
    const next = current[keys[i]];
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return nextData;
}

export default function RetroWaveEditor({ data, onChange }: TemplateEditorProps) {
  const content = data as LinktreeData & { animations?: string[] };
  const links = content.links || [];

  const updateField = (path: string, value: unknown) => {
    onChange(updateNestedField(data, path, value));
  };

  const updateLink = (index: number, key: 'title' | 'url', value: string) => {
    const nextLinks = [...links];
    if (!nextLinks[index]) {
      nextLinks[index] = { title: '', url: '' };
    }
    nextLinks[index] = { ...nextLinks[index], [key]: value };
    onChange({ ...data, links: nextLinks });
  };

  const addLink = () => {
    onChange({
      ...data,
      links: [...links, { title: '', url: '' }],
    });
  };

  const removeLink = (index: number) => {
    onChange({
      ...data,
      links: links.filter((_, currentIndex) => currentIndex !== index),
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            Retro Wave Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={content.profile?.name || ''}
              onChange={(e) => updateField('profile.name', e.target.value.toUpperCase())}
              placeholder="YOUR NAME"
            />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={content.profile?.bio || ''}
              onChange={(e) => updateField('profile.bio', e.target.value.toUpperCase())}
              placeholder="RETRO ENTHUSIAST"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Avatar URL</Label>
            <Input
              value={content.profile?.avatar || ''}
              onChange={(e) => updateField('profile.avatar', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Link Stack</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="rounded-lg border border-border p-3 space-y-2">
              <Input
                value={link.title}
                onChange={(e) => updateLink(index, 'title', e.target.value.toUpperCase())}
                placeholder="ENTER THE VOID"
              />
              <Input
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                placeholder="https://example.com"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLink(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Link
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addLink} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Color System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Background</Label>
            <Input
              value={content.theme?.background || ''}
              onChange={(e) => updateField('theme.background', e.target.value)}
              placeholder="#2d0a4e"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Text Color</Label>
              <Input
                type="color"
                value={content.theme?.textColor || '#00ffff'}
                onChange={(e) => updateField('theme.textColor', e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Color</Label>
              <Input
                type="color"
                value={content.theme?.buttonColor || '#ff00ff'}
                onChange={(e) => updateField('theme.buttonColor', e.target.value)}
                className="h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
