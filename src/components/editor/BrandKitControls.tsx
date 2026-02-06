// Brand Kit Controls for personalization
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Upload,
  Palette,
  Type,
  Code,
  ChevronDown,
  Sparkles,
  Wand2,
  RotateCcw,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandKit {
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  fontHeading?: string;
  customCSS?: string;
}

interface BrandKitControlsProps {
  brandKit: BrandKit;
  onChange: (brandKit: BrandKit) => void;
}

const FONT_PRESETS = [
  { name: 'Inter', value: 'Inter, sans-serif', category: 'Modern' },
  { name: 'Playfair Display', value: 'Playfair Display, serif', category: 'Elegant' },
  { name: 'Space Grotesk', value: 'Space Grotesk, sans-serif', category: 'Tech' },
  { name: 'Poppins', value: 'Poppins, sans-serif', category: 'Friendly' },
  { name: 'Caveat', value: 'Caveat, cursive', category: 'Handwritten' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono, monospace', category: 'Code' },
  { name: 'DM Serif Display', value: 'DM Serif Display, serif', category: 'Classic' },
  { name: 'Outfit', value: 'Outfit, sans-serif', category: 'Clean' },
];

const COLOR_PRESETS = [
  { name: 'Ocean', primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8' },
  { name: 'Forest', primary: '#22c55e', secondary: '#16a34a', accent: '#4ade80' },
  { name: 'Sunset', primary: '#f97316', secondary: '#ea580c', accent: '#fb923c' },
  { name: 'Royal', primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' },
  { name: 'Rose', primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' },
  { name: 'Slate', primary: '#64748b', secondary: '#475569', accent: '#94a3b8' },
  { name: 'Amber', primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
  { name: 'Teal', primary: '#14b8a6', secondary: '#0d9488', accent: '#2dd4bf' },
];

export function BrandKitControls({ brandKit, onChange }: BrandKitControlsProps) {
  const [openSections, setOpenSections] = useState<string[]>(['colors']);
  const [customCSSEnabled, setCustomCSSEnabled] = useState(!!brandKit.customCSS);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const updateBrandKit = (updates: Partial<BrandKit>) => {
    onChange({ ...brandKit, ...updates });
  };

  const applyColorPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    updateBrandKit({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    });
  };

  return (
    <div className="space-y-4">
      {/* Logo Section */}
      <CollapsibleSection
        title="Logo & Branding"
        icon={<Upload className="h-4 w-4" />}
        isOpen={openSections.includes('logo')}
        onToggle={() => toggleSection('logo')}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Logo URL</Label>
            <Input
              value={brandKit.logo || ''}
              onChange={(e) => updateBrandKit({ logo: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="h-9"
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 400x100px transparent PNG
            </p>
          </div>
          
          {brandKit.logo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-muted flex items-center justify-center"
            >
              <img 
                src={brandKit.logo} 
                alt="Logo preview" 
                className="max-h-16 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </motion.div>
          )}

          <div className="space-y-2">
            <Label className="text-xs">Favicon URL</Label>
            <Input
              value={brandKit.favicon || ''}
              onChange={(e) => updateBrandKit({ favicon: e.target.value })}
              placeholder="https://example.com/favicon.ico"
              className="h-9"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Colors Section */}
      <CollapsibleSection
        title="Brand Colors"
        icon={<Palette className="h-4 w-4" />}
        isOpen={openSections.includes('colors')}
        onToggle={() => toggleSection('colors')}
      >
        <div className="space-y-4">
          {/* Color Presets */}
          <div className="space-y-2">
            <Label className="text-xs">Quick Presets</Label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <motion.button
                  key={preset.name}
                  className="relative group p-1 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => applyColorPreset(preset)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex gap-0.5 rounded-md overflow-hidden">
                    <div 
                      className="h-8 flex-1" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="h-8 flex-1" 
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div 
                      className="h-8 flex-1" 
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {preset.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <ColorPicker
              label="Primary"
              value={brandKit.primaryColor || '#3b82f6'}
              onChange={(v) => updateBrandKit({ primaryColor: v })}
            />
            <ColorPicker
              label="Secondary"
              value={brandKit.secondaryColor || '#6366f1'}
              onChange={(v) => updateBrandKit({ secondaryColor: v })}
            />
            <ColorPicker
              label="Accent"
              value={brandKit.accentColor || '#8b5cf6'}
              onChange={(v) => updateBrandKit({ accentColor: v })}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Typography Section */}
      <CollapsibleSection
        title="Typography"
        icon={<Type className="h-4 w-4" />}
        isOpen={openSections.includes('typography')}
        onToggle={() => toggleSection('typography')}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Body Font</Label>
            <div className="grid grid-cols-2 gap-2">
              {FONT_PRESETS.map((font) => (
                <motion.button
                  key={font.name}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-all',
                    brandKit.fontFamily === font.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => updateBrandKit({ fontFamily: font.value })}
                  whileTap={{ scale: 0.98 }}
                >
                  <span 
                    className="text-sm block truncate"
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {font.category}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Custom Font URL (Google Fonts)</Label>
            <Input
              placeholder="https://fonts.googleapis.com/css2?family=..."
              className="h-9 text-xs"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Custom CSS Section */}
      <CollapsibleSection
        title="Custom CSS"
        icon={<Code className="h-4 w-4" />}
        isOpen={openSections.includes('css')}
        onToggle={() => toggleSection('css')}
        badge="Advanced"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Enable Custom CSS</Label>
            <Button
              variant={customCSSEnabled ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setCustomCSSEnabled(!customCSSEnabled)}
            >
              {customCSSEnabled ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Enabled
                </>
              ) : (
                'Enable'
              )}
            </Button>
          </div>

          <AnimatePresence>
            {customCSSEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Textarea
                  value={brandKit.customCSS || ''}
                  onChange={(e) => updateBrandKit({ customCSS: e.target.value })}
                  placeholder={`/* Custom CSS */
.my-class {
  color: var(--primary);
  border-radius: 12px;
}`}
                  className="font-mono text-xs min-h-[200px] bg-muted"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                    <Wand2 className="h-3 w-3" />
                    Format
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs gap-1"
                    onClick={() => updateBrandKit({ customCSS: '' })}
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CollapsibleSection>
    </div>
  );
}

// ============= Helper Components =============

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
}

function CollapsibleSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  badge,
}: CollapsibleSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <span className="text-sm font-medium">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary">
              {badge}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-4 px-1"
        >
          {children}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="flex gap-1.5">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 p-0.5 rounded cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-xs flex-1 font-mono"
        />
      </div>
    </div>
  );
}
