import React from 'react';
import { Palette, Type, Code2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrandKit } from '@/types/project';

interface BrandKitControlsProps {
  brandKit: BrandKit;
  onChange: (brandKit: BrandKit) => void;
}

const FONT_OPTIONS = [
  { name: 'Default Sans', value: 'Inter, sans-serif' },
  { name: 'Elegant Serif', value: 'Playfair Display, serif' },
  { name: 'Modern Mono', value: 'JetBrains Mono, monospace' },
  { name: 'Outfit (Modern)', value: 'Outfit, sans-serif' },
  { name: 'Caveat (Handwritten)', value: 'Caveat, cursive' },
  { name: 'Space Grotesk', value: 'Space Grotesk, sans-serif' },
];

export function BrandKitControls({ brandKit, onChange }: BrandKitControlsProps) {
  const updateBrand = (key: keyof BrandKit, value: string) => {
    onChange({
      ...brandKit,
      [key]: value,
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Colors */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Palette className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Brand Colors</h4>
          </div>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="h-9 w-12 p-1"
                  value={brandKit.primaryColor}
                  onChange={(e) => updateBrand('primaryColor', e.target.value)}
                />
                <Input
                  type="text"
                  className="h-9 font-mono text-xs"
                  value={brandKit.primaryColor}
                  onChange={(e) => updateBrand('primaryColor', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="h-9 w-12 p-1"
                  value={brandKit.secondaryColor}
                  onChange={(e) => updateBrand('secondaryColor', e.target.value)}
                />
                <Input
                  type="text"
                  className="h-9 font-mono text-xs"
                  value={brandKit.secondaryColor}
                  onChange={(e) => updateBrand('secondaryColor', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="h-9 w-12 p-1"
                  value={brandKit.accentColor}
                  onChange={(e) => updateBrand('accentColor', e.target.value)}
                />
                <Input
                  type="text"
                  className="h-9 font-mono text-xs"
                  value={brandKit.accentColor}
                  onChange={(e) => updateBrand('accentColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Typography */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Type className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Typography</h4>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Global Font Family</Label>
            <Select
              value={brandKit.fontFamily}
              onValueChange={(v) => updateBrand('fontFamily', v)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map(font => (
                  <SelectItem key={font.value} value={font.value} className="text-xs">
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Custom CSS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Code2 className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Custom CSS</h4>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Global Stylesheet</Label>
            <Textarea
              className="font-mono text-[10px] min-h-[200px] bg-muted/50"
              placeholder=".custom-builder-content { ... }"
              value={brandKit.customCSS || ''}
              onChange={(e) => updateBrand('customCSS', e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground italic">
              Target components using `.custom-builder-content` as the root.
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
