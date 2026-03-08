// Component Props Editor - Edit individual component properties
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Eye, EyeOff, Copy, Settings2, Sliders, Play, Plus } from 'lucide-react';
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
                      <PropField label="Gap">
                        <Input
                          type="text"
                          placeholder="e.g. 10px"
                          value={deviceMode === 'desktop' ? (component.props as any).gap || '' : (component.props as any)[`gap_${deviceMode}`] || (component.props as any).gap || ''}
                          onChange={(e) => updateProp(deviceMode === 'desktop' ? 'gap' : `gap_${deviceMode}`, e.target.value)}
                        />
                      </PropField>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Layout</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <PropField label="Width">
                        <Input
                          type="text"
                          placeholder="e.g. 100%"
                          value={deviceMode === 'desktop' ? (component.props as any).width || '' : (component.props as any)[`width_${deviceMode}`] || (component.props as any).width || ''}
                          onChange={(e) => updateProp(deviceMode === 'desktop' ? 'width' : `width_${deviceMode}`, e.target.value)}
                        />
                      </PropField>
                      <PropField label="Height">
                        <Input
                          type="text"
                          placeholder="e.g. auto"
                          value={deviceMode === 'desktop' ? (component.props as any).height || '' : (component.props as any)[`height_${deviceMode}`] || (component.props as any).height || ''}
                          onChange={(e) => updateProp(deviceMode === 'desktop' ? 'height' : `height_${deviceMode}`, e.target.value)}
                        />
                      </PropField>
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
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Style</h4>
                    <PropField label="Background">
                      <Input
                        type="text"
                        placeholder="e.g. #ffffff or url(...)"
                        value={(component.props as any).background || ''}
                        onChange={(e) => updateProp('background', e.target.value)}
                      />
                    </PropField>
                    <PropField label="Border">
                      <Input
                        type="text"
                        placeholder="e.g. 1px solid black"
                        value={(component.props as any).border || ''}
                        onChange={(e) => updateProp('border', e.target.value)}
                      />
                    </PropField>
                    <PropField label="Radius">
                      <Input
                        type="text"
                        placeholder="e.g. 12px"
                        value={deviceMode === 'desktop' ? (component.props as any).radius || '' : (component.props as any)[`radius_${deviceMode}`] || (component.props as any).radius || ''}
                        onChange={(e) => updateProp(deviceMode === 'desktop' ? 'radius' : `radius_${deviceMode}`, e.target.value)}
                      />
                    </PropField>
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
    case 'product-item':
      return (
        <>
          <PropField label="Title">
            <Input
              value={props.title as string}
              onChange={(e) => updateProp('title', e.target.value)}
            />
          </PropField>
          <PropField label="Product Number">
            <Input
              value={props.productNo as string}
              onChange={(e) => updateProp('productNo', e.target.value)}
            />
          </PropField>
          <PropField label="Product URL">
            <Input
              value={props.productUrl as string}
              onChange={(e) => updateProp('productUrl', e.target.value)}
            />
          </PropField>
          <PropField label="Price">
            <Input
              value={props.price as string}
              onChange={(e) => updateProp('price', e.target.value)}
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
          <PropField label="Button Text">
            <Input
              value={props.buttonText as string}
              onChange={(e) => updateProp('buttonText', e.target.value)}
            />
          </PropField>
          <PropField label="Badge (Optional)">
            <Input
              value={props.badge as string || ''}
              onChange={(e) => updateProp('badge', e.target.value)}
            />
          </PropField>
          <PropField label="Layout Style">
            <Select value={props.layout as string || 'card'} onValueChange={(v) => updateProp('layout', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card (Vertical)</SelectItem>
                <SelectItem value="list">List (Horizontal)</SelectItem>
                <SelectItem value="minimal">Minimal (No Image)</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'icon-list':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">List Items</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('items', { icon: '✓', text: 'New Item' })}>
              Add
            </Button>
          </div>
          {(props.items as any[] || []).map((item, i) => (
            <div key={i} className="flex gap-2 items-center p-2 border border-border rounded bg-muted/30">
              <Input className="w-12 h-8 px-1 text-center" value={item.icon} onChange={(e) => updateArrayProp('items', i, 'icon', e.target.value)} />
              <Input className="h-8" value={item.text} onChange={(e) => updateArrayProp('items', i, 'text', e.target.value)} />
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeArrayItem('items', i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <PropField label="Layout">
            <Select value={props.layout as string} onValueChange={(v) => updateProp('layout', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </div>
      );

    case 'stats':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stats</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('items', { value: '0', label: 'Label' })}>
              Add
            </Button>
          </div>
          {(props.items as any[] || []).map((item, i) => (
            <div key={i} className="space-y-2 p-2 border border-border rounded bg-muted/30">
              <Input className="h-8 font-bold" value={item.value} onChange={(e) => updateArrayProp('items', i, 'value', e.target.value)} placeholder="Value" />
              <Input className="h-8" value={item.label} onChange={(e) => updateArrayProp('items', i, 'label', e.target.value)} placeholder="Label" />
              <Button size="sm" variant="ghost" className="w-full h-7 text-destructive" onClick={() => removeArrayItem('items', i)}>Remove</Button>
            </div>
          ))}
          <PropField label="Layout">
            <Select value={props.layout as string} onValueChange={(v) => updateProp('layout', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="row">Row</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </div>
      );

    case 'feature-grid':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Features</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('items', { icon: '⚡', title: 'Feature', description: 'Desc' })}>
              Add
            </Button>
          </div>
          {(props.items as any[] || []).map((item, i) => (
            <div key={i} className="space-y-2 p-2 border border-border rounded bg-muted/30">
              <div className="flex gap-2">
                <Input className="w-10 h-8 px-1 text-center" value={item.icon} onChange={(e) => updateArrayProp('items', i, 'icon', e.target.value)} />
                <Input className="h-8 flex-1 font-bold" value={item.title} onChange={(e) => updateArrayProp('items', i, 'title', e.target.value)} placeholder="Title" />
              </div>
              <Textarea className="text-xs" value={item.description} onChange={(e) => updateArrayProp('items', i, 'description', e.target.value)} rows={2} />
              <Button size="sm" variant="ghost" className="w-full h-7 text-destructive" onClick={() => removeArrayItem('items', i)}>Remove</Button>
            </div>
          ))}
          <PropField label="Columns">
            <Select value={props.columns?.toString()} onValueChange={(v) => updateProp('columns', parseInt(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </div>
      );

    case 'countdown':
      return (
        <>
          <PropField label="Target Date (ISO)">
            <Input value={props.targetDate as string} onChange={(e) => updateProp('targetDate', e.target.value)} placeholder="2026-12-31T23:59:59Z" />
          </PropField>
          <PropField label="Title">
            <Input value={props.title as string} onChange={(e) => updateProp('title', e.target.value)} />
          </PropField>
          <PropField label="Style">
            <Select value={props.style as string} onValueChange={(v) => updateProp('style', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="flip">Flip Card</SelectItem>
                <SelectItem value="circular">Circular</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'contact-form':
      return (
        <div className="space-y-4">
          <PropField label="Form Title">
            <Input value={props.title as string} onChange={(e) => updateProp('title', e.target.value)} />
          </PropField>
          <PropField label="Submit Button Text">
            <Input value={props.submitText as string} onChange={(e) => updateProp('submitText', e.target.value)} />
          </PropField>
          <Separator />
          <Label className="text-xs font-bold">Fields</Label>
          {(props.fields as any[] || []).map((field, i) => (
            <div key={i} className="space-y-2 p-2 border border-border rounded bg-muted/30">
              <Input className="h-8" value={field.name} onChange={(e) => updateArrayProp('fields', i, 'name', e.target.value)} placeholder="Field Name" />
              <div className="flex items-center justify-between">
                <Select value={field.type} onValueChange={(v) => updateArrayProp('fields', i, 'type', v)}>
                  <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="textarea">Message</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Switch className="scale-75" checked={field.required} onCheckedChange={(v) => updateArrayProp('fields', i, 'required', v)} />
                  <span className="text-[10px]">Req</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );

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

    case 'faq':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">FAQ Items</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('items', { question: 'New Question', answer: 'New Answer' })}>
              Add
            </Button>
          </div>
          {(props.items as any[] || []).map((item, i) => (
            <div key={i} className="space-y-2 p-3 border border-border rounded-lg bg-muted/30 relative group">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                onClick={() => removeArrayItem('items', i)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Input
                value={item.question}
                onChange={(e) => updateArrayProp('items', i, 'question', e.target.value)}
                placeholder="Question"
              />
              <Textarea
                value={item.answer}
                onChange={(e) => updateArrayProp('items', i, 'answer', e.target.value)}
                placeholder="Answer"
                rows={2}
              />
            </div>
          ))}
          <PropField label="Style">
            <Select value={props.style as string} onValueChange={(v) => updateProp('style', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="accordion">Accordion</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </div>
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
      // Handle Primitive Text
      if (props.content !== undefined && props.fontSize !== undefined && typeof props.fontSize === 'string' && !['small', 'medium', 'large'].includes(props.fontSize)) {
        return (
          <div className="space-y-4">
            <PropField label="Content">
              <Textarea
                value={props.content as string}
                onChange={(e) => updateProp('content', e.target.value)}
                rows={4}
              />
            </PropField>
            <PropField label="Font Size (CSS)">
              <Input
                value={props.fontSize as string}
                onChange={(e) => updateProp('fontSize', e.target.value)}
                placeholder="e.g. 1.5rem"
              />
            </PropField>
            <PropField label="Font Weight">
              <Input
                value={props.fontWeight as string || ''}
                onChange={(e) => updateProp('fontWeight', e.target.value)}
                placeholder="e.g. 600"
              />
            </PropField>
            <PropField label="Color">
              <Input
                type="text"
                value={props.color as string || ''}
                onChange={(e) => updateProp('color', e.target.value)}
                placeholder="e.g. #ff0000"
              />
            </PropField>
            <PropField label="Alignment">
              <Select value={props.textAlign as string || 'left'} onValueChange={(v) => updateProp('textAlign', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </PropField>
            <PropField label="Line Height">
              <Input
                value={props.lineHeight as string || ''}
                onChange={(e) => updateProp('lineHeight', e.target.value)}
                placeholder="e.g. 1.5"
              />
            </PropField>
          </div>
        );
      }
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

    case 'social-links':
      return (
        <>
          <PropField label="Style">
            <Select value={props.style as string} onValueChange={(v) => updateProp('style', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="icons">Icons Only</SelectItem>
                <SelectItem value="buttons">Buttons</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
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
        </>
      );

    case 'cta':
      return (
        <>
          <PropField label="Title">
            <Input value={props.title as string} onChange={(e) => updateProp('title', e.target.value)} />
          </PropField>
          <PropField label="Description">
            <Textarea value={props.description as string} onChange={(e) => updateProp('description', e.target.value)} rows={2} />
          </PropField>
          <PropField label="Button Text">
            <Input value={props.buttonText as string} onChange={(e) => updateProp('buttonText', e.target.value)} />
          </PropField>
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="boxed">Boxed</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'newsletter':
      return (
        <>
          <PropField label="Title">
            <Input value={props.title as string} onChange={(e) => updateProp('title', e.target.value)} />
          </PropField>
          <PropField label="Placeholder">
            <Input value={props.placeholder as string} onChange={(e) => updateProp('placeholder', e.target.value)} />
          </PropField>
          <PropField label="Button Text">
            <Input value={props.buttonText as string} onChange={(e) => updateProp('buttonText', e.target.value)} />
          </PropField>
        </>
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

    case 'box':
      return (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Box is a generic container. Use the <strong>Advanced</strong> tab to control its layout, spacing, and background.
          </p>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Children</Label>
            <span className="text-[10px] text-muted-foreground">{(props.children as string[])?.length || 0} items</span>
          </div>
        </div>
      );

    case 'flex':
      return (
        <div className="space-y-4">
          <PropField label="Direction">
            <Select value={props.direction as string || 'row'} onValueChange={(v) => updateProp('direction', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="row">Row (Horizontal)</SelectItem>
                <SelectItem value="column">Column (Vertical)</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Align Items">
            <Select value={props.align as string || 'stretch'} onValueChange={(v) => updateProp('align', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Justify Content">
            <Select value={props.justify as string || 'start'} onValueChange={(v) => updateProp('justify', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="between">Space Between</SelectItem>
                <SelectItem value="around">Space Around</SelectItem>
                <SelectItem value="evenly">Space Evenly</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Wrap">
            <Select value={props.wrap as string || 'nowrap'} onValueChange={(v) => updateProp('wrap', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nowrap">No Wrap</SelectItem>
                <SelectItem value="wrap">Wrap</SelectItem>
                <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </div>
      );

    case 'grid':
      return (
        <div className="space-y-4">
          <PropField label="Columns (CSS Grid)">
            <Input
              value={props.columns as string || ''}
              onChange={(e) => updateProp('columns', e.target.value)}
              placeholder="e.g. repeat(3, 1fr)"
            />
          </PropField>
          <PropField label="Rows (CSS Grid)">
            <Input
              value={props.rows as string || ''}
              onChange={(e) => updateProp('rows', e.target.value)}
              placeholder="e.g. auto"
            />
          </PropField>
        </div>
      );

    case 'image-basic':
      return (
        <div className="space-y-4">
          <PropField label="Source URL">
            <Input
              value={props.src as string || ''}
              onChange={(e) => updateProp('src', e.target.value)}
            />
          </PropField>
          <PropField label="Alt Text">
            <Input
              value={props.alt as string || ''}
              onChange={(e) => updateProp('alt', e.target.value)}
            />
          </PropField>
          <PropField label="Object Fit">
            <Select value={props.objectFit as string || 'cover'} onValueChange={(v) => updateProp('objectFit', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="scale-down">Scale Down</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </div>
      );

    case 'button-basic':
      return (
        <div className="space-y-4">
          <PropField label="Button Text">
            <Input
              value={props.text as string || ''}
              onChange={(e) => updateProp('text', e.target.value)}
            />
          </PropField>
          <PropField label="URL (Optional)">
            <Input
              value={props.url as string || ''}
              onChange={(e) => updateProp('url', e.target.value)}
            />
          </PropField>
        </div>
      );

    case 'pricing':
      return (
        <>
          <PropField label="Title">
            <Input value={props.title as string} onChange={(e) => updateProp('title', e.target.value)} />
          </PropField>
          <PropField label="Price">
            <Input value={props.price as string} onChange={(e) => updateProp('price', e.target.value)} />
          </PropField>
          <PropField label="Period">
            <Input value={props.period as string} onChange={(e) => updateProp('period', e.target.value)} />
          </PropField>
          <PropField label="CTA Text">
            <Input value={props.ctaText as string} onChange={(e) => updateProp('ctaText', e.target.value)} />
          </PropField>
          <PropField label="Highlighted">
            <Switch checked={props.highlighted as boolean} onCheckedChange={(v) => updateProp('highlighted', v)} />
          </PropField>
        </>
      );

    case 'testimonial':
      return (
        <>
          <PropField label="Quote">
            <Textarea value={props.quote as string} onChange={(e) => updateProp('quote', e.target.value)} rows={3} />
          </PropField>
          <PropField label="Author">
            <Input value={props.author as string} onChange={(e) => updateProp('author', e.target.value)} />
          </PropField>
          <PropField label="Role">
            <Input value={props.role as string} onChange={(e) => updateProp('role', e.target.value)} />
          </PropField>
          <PropField label="Rating">
            <Slider value={[props.rating as number || 5]} onValueChange={([v]) => updateProp('rating', v)} min={1} max={5} step={1} />
          </PropField>
        </>
      );

    case 'video':
      return (
        <>
          <PropField label="Video URL (Embed)">
            <Input value={props.url as string} onChange={(e) => updateProp('url', e.target.value)} />
          </PropField>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Switch checked={props.autoplay as boolean} onCheckedChange={(v) => updateProp('autoplay', v)} />
              <Label className="text-xs">Autoplay</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={props.muted as boolean} onCheckedChange={(v) => updateProp('muted', v)} />
              <Label className="text-xs">Muted</Label>
            </div>
          </div>
        </>
      );

    case 'marquee':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Items</Label>
            <Button size="sm" variant="outline" onClick={() => updateProp('items', [...(props.items as string[]), 'New Item'])}>
              Add Item
            </Button>
          </div>
          {(props.items as string[] || []).map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newItems = [...(props.items as string[])];
                  newItems[i] = e.target.value;
                  updateProp('items', newItems);
                }}
              />
              <Button size="icon" variant="ghost" className="h-10 w-10 text-destructive" onClick={() => {
                const newItems = [...(props.items as string[])];
                newItems.splice(i, 1);
                updateProp('items', newItems);
              }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <PropField label="Speed (Duration in s)">
            <Input type="number" value={props.speed as number} onChange={(e) => updateProp('speed', parseInt(e.target.value))} />
          </PropField>
          <PropField label="Gap">
            <Input value={props.gap as string} onChange={(e) => updateProp('gap', e.target.value)} placeholder="40px" />
          </PropField>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Direction</Label>
            <Select value={props.direction as string} onValueChange={(v) => updateProp('direction', v)}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Pause on Hover</Label>
            <Switch checked={props.pauseOnHover as boolean} onCheckedChange={(v) => updateProp('pauseOnHover', v)} />
          </div>
        </div>
      );

    case 'bento-grid':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bento Items</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('items', { title: 'New Item', description: 'Desc', size: 'small' })}>
              Add
            </Button>
          </div>
          {(props.items as any[] || []).map((item, i) => (
            <div key={i} className="space-y-2 p-3 border border-border rounded-lg bg-muted/30 relative group">
              <Button size="icon" variant="ghost" className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => removeArrayItem('items', i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
              <Input value={item.title} onChange={(e) => updateArrayProp('items', i, 'title', e.target.value)} placeholder="Title" />
              <Textarea value={item.description} onChange={(e) => updateArrayProp('items', i, 'description', e.target.value)} placeholder="Description" rows={2} />
              <Input value={item.image || ''} onChange={(e) => updateArrayProp('items', i, 'image', e.target.value)} placeholder="Image URL (Optional)" />
              <div className="flex gap-2">
                <Select value={item.size} onValueChange={(v) => updateArrayProp('items', i, 'size', v)}>
                  <SelectTrigger className="h-8 flex-1 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="color" className="w-12 h-8 p-1" value={item.color || '#ffffff'} onChange={(e) => updateArrayProp('items', i, 'color', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      );

    case 'process-steps':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Steps</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('steps', { title: 'New Step', description: 'Desc', icon: '✨' })}>
              Add
            </Button>
          </div>
          {(props.steps as any[] || []).map((step, i) => (
            <div key={i} className="space-y-2 p-3 border border-border rounded-lg bg-muted/30 relative group">
              <Button size="icon" variant="ghost" className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => removeArrayItem('steps', i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
              <div className="flex gap-2">
                <Input className="w-12" value={step.icon} onChange={(e) => updateArrayProp('steps', i, 'icon', e.target.value)} />
                <Input className="flex-1" value={step.title} onChange={(e) => updateArrayProp('steps', i, 'title', e.target.value)} />
              </div>
              <Textarea value={step.description} onChange={(e) => updateArrayProp('steps', i, 'description', e.target.value)} rows={2} />
            </div>
          ))}
          <PropField label="Layout">
            <Select value={props.layout as string} onValueChange={(v) => updateProp('layout', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Accent Color">
            <Input type="color" value={props.color as string || '#6366f1'} onChange={(e) => updateProp('color', e.target.value)} />
          </PropField>
        </div>
      );

    case 'logo-cloud':
      return (
        <div className="space-y-4">
          <PropField label="Title">
            <Input value={props.title as string || ''} onChange={(e) => updateProp('title', e.target.value)} />
          </PropField>
          <PropField label="Display Style">
            <Select value={props.style as string} onValueChange={(v) => updateProp('style', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="marquee">Scrolling</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <div className="flex items-center justify-between pt-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Logos</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('logos', { src: '', alt: '' })}>
              Add Logo
            </Button>
          </div>
          {(props.logos as any[] || []).map((logo, i) => (
            <div key={i} className="space-y-2 p-2 border border-border rounded bg-muted/30 relative group">
              <Button size="icon" variant="ghost" className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => removeArrayItem('logos', i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
              <Input className="h-8" value={logo.src} onChange={(e) => updateArrayProp('logos', i, 'src', e.target.value)} placeholder="Logo URL" />
              <Input className="h-8" value={logo.alt} onChange={(e) => updateArrayProp('logos', i, 'alt', e.target.value)} placeholder="Alt Text" />
            </div>
          ))}
        </div>
      );

    case 'layout-section':
      return (
        <>
          <PropField label="Background Color">
            <Input type="color" value={props.backgroundColor as string || '#ffffff'} onChange={(e) => updateProp('backgroundColor', e.target.value)} />
          </PropField>
          <PropField label="Background Image URL">
            <Input value={props.backgroundImage as string || ''} onChange={(e) => updateProp('backgroundImage', e.target.value)} />
          </PropField>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Full Width</Label>
            <Switch checked={props.fullWidth as boolean} onCheckedChange={(v) => updateProp('fullWidth', v)} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Use Advanced tab for detailed spacing.</p>
        </>
      );

    case 'layout-container':
      return (
        <>
          <PropField label="Max Width">
            <Select value={props.maxWidth as string} onValueChange={(v) => updateProp('maxWidth', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <p className="text-[10px] text-muted-foreground mt-2">Use Advanced tab for detailed spacing.</p>
        </>
      );

    case 'layout-stack':
      return (
        <>
          <PropField label="Direction">
            <Select value={props.direction as string} onValueChange={(v) => updateProp('direction', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Align">
            <Select value={props.align as string} onValueChange={(v) => updateProp('align', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Justify">
            <Select value={props.justify as string} onValueChange={(v) => updateProp('justify', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="between">Space Between</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <p className="text-[10px] text-muted-foreground mt-2">Use Advanced tab for gap and padding.</p>
        </>
      );

    case 'layout-grid':
      return (
        <>
          <PropField label="Columns (CSS Grid)">
            <Input value={props.columns as string} onChange={(e) => updateProp('columns', e.target.value)} placeholder="repeat(2, 1fr)" />
          </PropField>
          <PropField label="Rows (CSS Grid)">
            <Input value={props.rows as string} onChange={(e) => updateProp('rows', e.target.value)} placeholder="auto" />
          </PropField>
          <p className="text-[10px] text-muted-foreground mt-2">Use Advanced tab for gap and padding.</p>
        </>
      );

    case 'layout-columns':
      return (
        <>
          <PropField label="Column Count">
            <Slider
              value={[props.count as number || 2]}
              onValueChange={([v]) => updateProp('count', v)}
              min={1}
              max={6}
              step={1}
            />
            <div className="text-center text-xs mt-1">{props.count || 2} Columns</div>
          </PropField>
          <p className="text-[10px] text-muted-foreground mt-2">Use Advanced tab for gap and padding.</p>
        </>
      );

    case 'content-paragraph':
      return (
        <>
          <PropField label="Text Content">
            <Textarea value={props.text as string} onChange={(e) => updateProp('text', e.target.value)} rows={4} />
          </PropField>
          <PropField label="Font Size">
            <Input value={props.fontSize as string} onChange={(e) => updateProp('fontSize', e.target.value)} placeholder="16px" />
          </PropField>
          <PropField label="Line Height">
            <Input value={props.lineHeight as string} onChange={(e) => updateProp('lineHeight', e.target.value)} placeholder="1.6" />
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
          <PropField label="Color">
            <Input type="color" value={props.color as string || '#000000'} onChange={(e) => updateProp('color', e.target.value)} />
          </PropField>
        </>
      );

    case 'content-badge':
      return (
        <>
          <PropField label="Text">
            <Input value={props.text as string} onChange={(e) => updateProp('text', e.target.value)} />
          </PropField>
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="destructive">Destructive</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Size">
            <Select value={props.size as string} onValueChange={(v) => updateProp('size', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'content-avatar':
      return (
        <>
          <PropField label="Image URL">
            <Input value={props.src as string || ''} onChange={(e) => updateProp('src', e.target.value)} />
          </PropField>
          <PropField label="Fallback Initials">
            <Input value={props.fallback as string} onChange={(e) => updateProp('fallback', e.target.value)} maxLength={2} />
          </PropField>
          <PropField label="Size">
            <Select value={props.size as string} onValueChange={(v) => updateProp('size', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Shape">
            <Select value={props.shape as string} onValueChange={(v) => updateProp('shape', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'ui-tabs':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tabs</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('items', { label: 'New Tab', content: 'Content' })}>
              Add Tab
            </Button>
          </div>
          {(props.items as any[] || []).map((item, i) => (
            <div key={i} className="space-y-2 p-2 border border-border rounded bg-muted/30 relative group">
              <Button size="icon" variant="ghost" className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => removeArrayItem('items', i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
              <Input className="h-8 font-bold" value={item.label} onChange={(e) => updateArrayProp('items', i, 'label', e.target.value)} placeholder="Label" />
              <Textarea className="text-xs" value={item.content} onChange={(e) => updateArrayProp('items', i, 'content', e.target.value)} placeholder="Content" rows={2} />
            </div>
          ))}
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </div>
      );

    case 'ui-carousel':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Images</Label>
            <Button size="sm" variant="outline" onClick={() => updateProp('images', [...(props.images as string[]), ''])}>
              Add Image
            </Button>
          </div>
          {(props.images as string[] || []).map((img, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={img}
                onChange={(e) => {
                  const newImages = [...(props.images as string[])];
                  newImages[i] = e.target.value;
                  updateProp('images', newImages);
                }}
                placeholder="Image URL"
              />
              <Button size="icon" variant="ghost" className="h-10 w-10 text-destructive" onClick={() => {
                const newImages = [...(props.images as string[])];
                newImages.splice(i, 1);
                updateProp('images', newImages);
              }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <PropField label="Aspect Ratio">
            <Select value={props.aspectRatio as string} onValueChange={(v) => updateProp('aspectRatio', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aspect-video">Widescreen (16:9)</SelectItem>
                <SelectItem value="aspect-square">Square (1:1)</SelectItem>
                <SelectItem value="aspect-auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Autoplay</Label>
            <Switch checked={props.autoplay as boolean} onCheckedChange={(v) => updateProp('autoplay', v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Show Arrows</Label>
            <Switch checked={props.showArrows as boolean} onCheckedChange={(v) => updateProp('showArrows', v)} />
          </div>
        </div>
      );

    case 'ui-breadcrumb':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Links</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('items', { label: 'New Link', url: '#' })}>
              Add Link
            </Button>
          </div>
          {(props.items as any[] || []).map((item, i) => (
            <div key={i} className="space-y-2 p-2 border border-border rounded bg-muted/30 relative group">
              <Button size="icon" variant="ghost" className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => removeArrayItem('items', i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
              <Input className="h-8" value={item.label} onChange={(e) => updateArrayProp('items', i, 'label', e.target.value)} placeholder="Label" />
              <Input className="h-8" value={item.url} onChange={(e) => updateArrayProp('items', i, 'url', e.target.value)} placeholder="URL" />
            </div>
          ))}
        </div>
      );

    case 'ui-accordion':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Items</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('items', { title: 'New Item', content: 'Description' })}>
              Add
            </Button>
          </div>
          {(props.items as any[] || []).map((item, i) => (
            <div key={i} className="space-y-2 p-2 border border-border rounded bg-muted/30 relative group">
              <Button size="icon" variant="ghost" className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => removeArrayItem('items', i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
              <Input className="h-8 font-bold" value={item.title} onChange={(e) => updateArrayProp('items', i, 'title', e.target.value)} placeholder="Title" />
              <Textarea className="text-xs" value={item.content} onChange={(e) => updateArrayProp('items', i, 'content', e.target.value)} placeholder="Content" rows={2} />
            </div>
          ))}
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </div>
      );

    case 'ui-dropdown':
      return (
        <div className="space-y-4">
          <PropField label="Label">
            <Input value={props.label as string} onChange={(e) => updateProp('label', e.target.value)} />
          </PropField>
          <div className="flex items-center justify-between pt-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Menu Items</Label>
            <Button size="sm" variant="outline" onClick={() => addArrayItem('items', { label: 'New Item', url: '#' })}>
              Add
            </Button>
          </div>
          {(props.items as any[] || []).map((item, i) => (
            <div key={i} className="space-y-2 p-2 border border-border rounded bg-muted/30 relative group">
              <Button size="icon" variant="ghost" className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => removeArrayItem('items', i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
              <Input className="h-8" value={item.label} onChange={(e) => updateArrayProp('items', i, 'label', e.target.value)} placeholder="Label" />
              <Input className="h-8" value={item.url} onChange={(e) => updateArrayProp('items', i, 'url', e.target.value)} placeholder="URL" />
            </div>
          ))}
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </div>
      );

    case 'ui-modal':
      return (
        <>
          <PropField label="Trigger Button Text">
            <Input value={props.triggerText as string} onChange={(e) => updateProp('triggerText', e.target.value)} />
          </PropField>
          <PropField label="Modal Title">
            <Input value={props.title as string} onChange={(e) => updateProp('title', e.target.value)} />
          </PropField>
          <PropField label="Description">
            <Textarea value={props.description as string} onChange={(e) => updateProp('description', e.target.value)} rows={3} />
          </PropField>
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="glass">Glass Morphism</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'ui-tooltip':
      return (
        <>
          <PropField label="Trigger Text">
            <Input value={props.text as string} onChange={(e) => updateProp('text', e.target.value)} />
          </PropField>
          <PropField label="Tooltip Content">
            <Input value={props.content as string} onChange={(e) => updateProp('content', e.target.value)} />
          </PropField>
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'ui-toast':
      return (
        <>
          <PropField label="Toast Title">
            <Input value={props.title as string} onChange={(e) => updateProp('title', e.target.value)} />
          </PropField>
          <PropField label="Description">
            <Textarea value={props.description as string} onChange={(e) => updateProp('description', e.target.value)} rows={2} />
          </PropField>
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="destructive">Destructive</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'ui-progress-bar':
      return (
        <>
          <PropField label="Progress Value">
            <div className="flex items-center gap-4">
              <Slider
                value={[props.value as number || 0]}
                onValueChange={([v]) => updateProp('value', v)}
                max={props.max as number || 100}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                className="w-16 h-8 text-xs"
                value={props.value as number}
                onChange={(e) => updateProp('value', parseInt(e.target.value))}
              />
            </div>
          </PropField>
          <PropField label="Max Value">
            <Input type="number" value={props.max as number} onChange={(e) => updateProp('max', parseInt(e.target.value))} />
          </PropField>
          <PropField label="Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Primary</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <div className="flex items-center justify-between pt-2">
            <Label className="text-xs">Show Value Label</Label>
            <Switch checked={props.showValue as boolean} onCheckedChange={(v) => updateProp('showValue', v)} />
          </div>
        </>
      );

    case 'ui-skeleton-loader':
      return (
        <>
          <PropField label="Shape Type">
            <Select value={props.type as string} onValueChange={(v) => updateProp('type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Rows</SelectItem>
                <SelectItem value="circle">Profile Card</SelectItem>
                <SelectItem value="rect">Rectangle</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Item Count">
            <Slider value={[props.count as number || 1]} onValueChange={([v]) => updateProp('count', v)} min={1} max={10} step={1} />
            <div className="text-center text-[10px] mt-1 text-muted-foreground">{props.count} items</div>
          </PropField>
          <PropField label="Animation Variant">
            <Select value={props.variant as string} onValueChange={(v) => updateProp('variant', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pulse">Pulse</SelectItem>
                <SelectItem value="wave">Wave</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
        </>
      );

    case 'form-input':
      return (
        <>
          <PropField label="Label">
            <Input value={props.label as string} onChange={(e) => updateProp('label', e.target.value)} />
          </PropField>
          <PropField label="Placeholder">
            <Input value={props.placeholder as string} onChange={(e) => updateProp('placeholder', e.target.value)} />
          </PropField>
          <PropField label="Type">
            <Select value={props.type as string} onValueChange={(v) => updateProp('type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="password">Password</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="tel">Phone</SelectItem>
              </SelectContent>
            </Select>
          </PropField>
          <PropField label="Help Text (Optional)">
            <Input value={props.helpText as string || ''} onChange={(e) => updateProp('helpText', e.target.value)} />
          </PropField>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Required</Label>
            <Switch checked={props.required as boolean} onCheckedChange={(v) => updateProp('required', v)} />
          </div>
        </>
      );

    case 'form-checkbox':
      return (
        <>
          <PropField label="Label">
            <Input value={props.label as string} onChange={(e) => updateProp('label', e.target.value)} />
          </PropField>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Checked by Default</Label>
            <Switch checked={props.checked as boolean} onCheckedChange={(v) => updateProp('checked', v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Required</Label>
            <Switch checked={props.required as boolean} onCheckedChange={(v) => updateProp('required', v)} />
          </div>
        </>
      );

    case 'form-switch':
      return (
        <>
          <PropField label="Label">
            <Input value={props.label as string} onChange={(e) => updateProp('label', e.target.value)} />
          </PropField>
          <div className="flex items-center justify-between">
            <Label className="text-xs">On by Default</Label>
            <Switch checked={props.checked as boolean} onCheckedChange={(v) => updateProp('checked', v)} />
          </div>
        </>
      );

    case 'form-slider':
      return (
        <>
          <PropField label="Label">
            <Input value={props.label as string} onChange={(e) => updateProp('label', e.target.value)} />
          </PropField>
          <div className="grid grid-cols-2 gap-4">
            <PropField label="Min">
              <Input type="number" value={props.min as number} onChange={(e) => updateProp('min', parseInt(e.target.value))} />
            </PropField>
            <PropField label="Max">
              <Input type="number" value={props.max as number} onChange={(e) => updateProp('max', parseInt(e.target.value))} />
            </PropField>
          </div>
          <PropField label="Step">
            <Input type="number" value={props.step as number} onChange={(e) => updateProp('step', parseInt(e.target.value))} />
          </PropField>
          <PropField label="Default Value">
            <Input type="number" value={props.defaultValue as number} onChange={(e) => updateProp('defaultValue', parseInt(e.target.value))} />
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
