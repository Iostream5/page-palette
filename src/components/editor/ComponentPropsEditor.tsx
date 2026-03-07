// Component Props Editor - Edit individual component properties
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Eye, EyeOff, Copy, Settings2, Sliders, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PageComponent } from '@/types/page-components';
import { cn } from '@/lib/utils';
import { AnimationSelector } from './AnimationSelector';

function PropField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

interface ComponentPropsEditorProps {
  component: PageComponent;
  onUpdate: (updated: PageComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onClose: () => void;
}

export function ComponentPropsEditor({
  component,
  onUpdate,
  onDelete,
  onDuplicate,
  onClose,
  deviceMode = 'desktop',
}: ComponentPropsEditorProps & { deviceMode?: 'desktop' | 'tablet' | 'mobile' }) {
  const [activeTab, setActiveTab] = useState<'content' | 'animations' | 'advanced'>('content');

  const updateProp = (key: string, value: unknown) => {
    onUpdate({
      ...component,
      props: {
        ...component.props,
        [key]: value,
      },
    } as PageComponent);
  };

  const updateArrayProp = (key: string, index: number, field: string, value: unknown) => {
    const arr = [...((component.props as Record<string, unknown>)[key] as unknown[])];
    (arr[index] as Record<string, unknown>)[field] = value;
    updateProp(key, arr);
  };

  const addArrayItem = (key: string, defaultItem: Record<string, unknown>) => {
    const arr = [...((component.props as Record<string, unknown>)[key] as unknown[] || [])];
    arr.push(defaultItem);
    updateProp(key, arr);
  };

  const removeArrayItem = (key: string, index: number) => {
    const arr = [...((component.props as Record<string, unknown>)[key] as unknown[])];
    arr.splice(index, 1);
    updateProp(key, arr);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full flex flex-col bg-card border-l border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground capitalize">
            {component.type.replace('-', ' ')}
          </h3>
          <p className="text-xs text-muted-foreground">Edit properties</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onUpdate({ ...component, visible: !component.visible })}
        >
          {component.visible ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" /> Hide
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" /> Show
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={onDuplicate}>
          <Copy className="h-4 w-4 mr-1" /> Duplicate
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('content')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
            activeTab === 'content' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:bg-accent"
          )}
        >
          <Sliders className="h-4 w-4" />
          Content
        </button>
        <button
          onClick={() => setActiveTab('animations')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
            activeTab === 'animations' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:bg-accent"
          )}
        >
          <Play className="h-4 w-4" />
          Animations
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
            activeTab === 'advanced' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:bg-accent"
          )}
        >
          <Settings2 className="h-4 w-4" />
          Advanced
        </button>
      </div>

      {/* Properties */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'content' ? (
                renderPropsEditor(component, updateProp, updateArrayProp, addArrayItem, removeArrayItem)
              ) : activeTab === 'animations' ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Component Animations</h4>
                    <AnimationSelector
                      value={component.animations || []}
                      onChange={(animations) => onUpdate({ ...component, animations })}
                      maxSelections={4}
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Tip: Entrance animations play when the component comes into view. Hover animations play when you mouse over.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Spacing</h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">{deviceMode}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <PropField label="Padding">
                        <Input
                          type="text"
                          placeholder="e.g. 20px"
                          value={deviceMode === 'desktop' ? (component.props as any).padding || '' : (component.props as any)[`padding_${deviceMode}`] || (component.props as any).padding || ''}
                          onChange={(e) => updateProp(deviceMode === 'desktop' ? 'padding' : `padding_${deviceMode}`, e.target.value)}
                        />
                      </PropField>
                      <PropField label="Margin">
                        <Input
                          type="text"
                          placeholder="e.g. 10px"
                          value={deviceMode === 'desktop' ? (component.props as any).margin || '' : (component.props as any)[`margin_${deviceMode}`] || (component.props as any).margin || ''}
                          onChange={(e) => updateProp(deviceMode === 'desktop' ? 'margin' : `margin_${deviceMode}`, e.target.value)}
                        />
                      </PropField>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Layout</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <PropField label="Z-Index">
                        <Input
                          type="number"
                          value={(component.props as any).zIndex || 0}
                          onChange={(e) => updateProp('zIndex', parseInt(e.target.value))}
                        />
                      </PropField>
                      <PropField label="Opacity">
                        <div className="flex items-center gap-2 pt-2">
                          <Slider
                            value={[(component.props as any).opacity ?? 100]}
                            onValueChange={([v]) => updateProp('opacity', v)}
                            min={0}
                            max={100}
                            step={5}
                          />
                          <span className="text-xs font-mono w-8 text-right">{(component.props as any).opacity ?? 100}%</span>
                        </div>
                      </PropField>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Effects</h4>
                    <PropField label="Shadow">
                      <Select
                        value={(component.props as any).boxShadow || 'none'}
                        onValueChange={(v) => updateProp('boxShadow', v)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="md">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                          <SelectItem value="xl">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </PropField>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.div>
  );
}

function renderPropsEditor(
  component: PageComponent,
  updateProp: (key: string, value: unknown) => void,
  updateArrayProp: (key: string, index: number, field: string, value: unknown) => void,
  addArrayItem: (key: string, defaultItem: Record<string, unknown>) => void,
  removeArrayItem: (key: string, index: number) => void
) {
  const props = component.props as Record<string, unknown>;

  switch (component.type) {
    case 'hero':
      return (
        <>
          <PropField label="Title">
            <Input
              value={props.title as string}
              onChange={(e) => updateProp('title', e.target.value)}
            />
          </PropField>
          <PropField label="Subtitle">
            <Textarea
              value={props.subtitle as string}
              onChange={(e) => updateProp('subtitle', e.target.value)}
              rows={2}
            />
          </PropField>
          <PropField label="Background Gradient">
            <Input
              value={props.backgroundGradient as string}
              onChange={(e) => updateProp('backgroundGradient', e.target.value)}
              placeholder="linear-gradient(...)"
            />
          </PropField>
          <PropField label="CTA Button Text">
            <Input
              value={props.ctaText as string}
              onChange={(e) => updateProp('ctaText', e.target.value)}
            />
          </PropField>
          <PropField label="CTA Button URL">
            <Input
              value={props.ctaUrl as string}
              onChange={(e) => updateProp('ctaUrl', e.target.value)}
            />
          </PropField>
          <PropField label="Alignment">
            <Select value={props.alignment as string} onValueChange={(v) => updateProp('alignment', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Height">
            <Select value={props.height as string} onValueChange={(v) => updateProp('height', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'heading':
      return (
        <>
          <PropField label="Text">
            <Input
              value={props.text as string}
              onChange={(e) => updateProp('text', e.target.value)}
            />
          </PropField>
          <PropField label="Level">
            <Select value={props.level as string} onValueChange={(v) => updateProp('level', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1 - Main Title</SelectItem>
                <SelectItem value="h2">H2 - Section</SelectItem>
                <SelectItem value="h3">H3 - Subsection</SelectItem>
                <SelectItem value="h4">H4 - Small</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Alignment">
            <Select value={props.alignment as string} onValueChange={(v) => updateProp('alignment', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Color">
            <Input
              type="color"
              value={props.color as string || '#000000'}
              onChange={(e) => updateProp('color', e.target.value)}
              className="h-10 w-full"
            />
          </PropField>
        </>
      );

    case 'text':
      return (
        <>
          <PropField label="Content">
            <Textarea
              value={props.content as string}
              onChange={(e) => updateProp('content', e.target.value)}
              rows={4}
            />
          </PropField>
          <PropField label="Font Size">
            <Select value={props.fontSize as string} onValueChange={(v) => updateProp('fontSize', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Alignment">
            <Select value={props.alignment as string} onValueChange={(v) => updateProp('alignment', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'button':
      return (
        <>
          <PropField label="Text">
            <Input
              value={props.text as string}
              onChange={(e) => updateProp('text', e.target.value)}
            />
          </PropField>
          <PropField label="URL">
            <Input
              value={props.url as string}
              onChange={(e) => updateProp('url', e.target.value)}
            />
          </PropField>
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Size">
            <Select value={props.size as string} onValueChange={(v) => updateProp('size', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Full Width">
            <Switch
              checked={props.fullWidth as boolean}
              onCheckedChange={(v) => updateProp('fullWidth', v)}
            />
          </PropField>
        </>
      );

    case 'card':
      return (
        <>
          <PropField label="Title">
            <Input
              value={props.title as string}
              onChange={(e) => updateProp('title', e.target.value)}
            />
          </PropField>
          <PropField label="Description">
            <Textarea
              value={props.description as string}
              onChange={(e) => updateProp('description', e.target.value)}
              rows={2}
            />
          </PropField>
          <PropField label="Image URL">
            <Input
              value={props.image as string}
              onChange={(e) => updateProp('image', e.target.value)}
            />
          </PropField>
          <PropField label="CTA Text">
            <Input
              value={props.ctaText as string}
              onChange={(e) => updateProp('ctaText', e.target.value)}
            />
          </PropField>
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="elevated">Elevated</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="glass">Glass</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'image':
      return (
        <>
          <PropField label="Image URL">
            <Input
              value={props.src as string}
              onChange={(e) => updateProp('src', e.target.value)}
            />
          </PropField>
          <PropField label="Alt Text">
            <Input
              value={props.alt as string}
              onChange={(e) => updateProp('alt', e.target.value)}
            />
          </PropField>
          <PropField label="Caption">
            <Input
              value={props.caption as string}
              onChange={(e) => updateProp('caption', e.target.value)}
            />
          </PropField>
          <PropField label="Aspect Ratio">
            <Select value={props.aspectRatio as string} onValueChange={(v) => updateProp('aspectRatio', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">Square (1:1)</SelectItem>
                <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                <SelectItem value="4:3">Standard (4:3)</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Rounded Corners">
            <Switch
              checked={props.rounded as boolean}
              onCheckedChange={(v) => updateProp('rounded', v)}
            />
          </PropField>
          <PropField label="Shadow">
            <Switch
              checked={props.shadow as boolean}
              onCheckedChange={(v) => updateProp('shadow', v)}
            />
          </PropField>
        </>
      );

    case 'spacer':
      return (
        <PropField label="Height">
          <Select value={props.height as string} onValueChange={(v) => updateProp('height', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xlarge">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </PropField>
      );

    case 'divider':
      return (
        <>
          <PropField label="Style">
            <Select value={props.style as string} onValueChange={(v) => updateProp('style', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Thickness">
            <Select value={props.thickness as string} onValueChange={(v) => updateProp('thickness', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="thin">Thin</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="thick">Thick</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    default:
      return (
        <div className="text-sm text-muted-foreground">
          Props editor for {component.type} component coming soon.
        </div>
      );
  }
}
