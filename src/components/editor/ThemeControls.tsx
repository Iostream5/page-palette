 import { Label } from '@/components/ui/label';
 import { Slider } from '@/components/ui/slider';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { ThemeSettings } from '@/types/builder';
 import { 
   Palette, 
   Square, 
   Sparkles, 
   Zap,
   Circle,
   Sun,
   Moon
 } from 'lucide-react';
 
 interface ThemeControlsProps {
  theme: ThemeSettings | undefined;
  updateField: (path: string, value: string) => void;
   category: 'linktree' | 'gallery' | 'letter';
 }
 
const updateNumericField = (updateField: (path: string, value: string) => void, path: string, value: number) => {
  updateField(path, value.toString());
};

 export function ThemeControls({ theme, updateField, category }: ThemeControlsProps) {
  const themeData = theme || {};
   return (
     <Card className="border-primary/20 bg-gradient-to-br from-card to-muted/30">
       <CardHeader className="pb-3">
         <CardTitle className="flex items-center gap-2 text-sm">
           <Palette className="h-4 w-4 text-primary" />
           Theme & Style
         </CardTitle>
       </CardHeader>
       <CardContent className="space-y-6">
         {/* Color Controls */}
         <div className="space-y-4">
           <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Colors</h4>
           <div className="grid grid-cols-2 gap-3">
             <ColorInput
               label="Background"
              value={themeData.background || '#ffffff'}
               onChange={(v) => updateField('theme.background', v)}
               icon={<Sun className="h-3 w-3" />}
             />
             <ColorInput
               label="Text"
              value={themeData.textColor || '#1a1a1a'}
               onChange={(v) => updateField('theme.textColor', v)}
               icon={<Moon className="h-3 w-3" />}
             />
             {category === 'linktree' && (
               <>
                 <ColorInput
                   label="Button"
                  value={themeData.buttonColor || '#1a1a1a'}
                   onChange={(v) => updateField('theme.buttonColor', v)}
                   icon={<Square className="h-3 w-3" />}
                 />
                 <ColorInput
                   label="Button Text"
                  value={themeData.buttonTextColor || '#ffffff'}
                   onChange={(v) => updateField('theme.buttonTextColor', v)}
                   icon={<Circle className="h-3 w-3" />}
                 />
               </>
             )}
             {(category === 'gallery' || category === 'letter') && (
               <ColorInput
                 label="Accent"
                value={themeData.accentColor || '#3b82f6'}
                 onChange={(v) => updateField('theme.accentColor', v)}
                 icon={<Sparkles className="h-3 w-3" />}
               />
             )}
           </div>
         </div>
 
         {/* Advanced Controls */}
         <div className="space-y-4">
           <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Effects</h4>
           
           {/* Border Radius */}
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <Label className="text-xs flex items-center gap-2">
                 <Square className="h-3 w-3 text-muted-foreground" />
                 Border Radius
               </Label>
               <span className="text-xs text-muted-foreground font-mono">
                {themeData.borderRadius ?? 12}px
               </span>
             </div>
             <Slider
              value={[themeData.borderRadius ?? 12]}
              onValueChange={([v]) => updateNumericField(updateField, 'theme.borderRadius', v)}
               min={0}
               max={32}
               step={2}
               className="cursor-pointer"
             />
             <div className="flex justify-between text-[10px] text-muted-foreground">
               <span>Sharp</span>
               <span>Rounded</span>
             </div>
           </div>
 
           {/* Shadow Intensity */}
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <Label className="text-xs flex items-center gap-2">
                 <Sparkles className="h-3 w-3 text-muted-foreground" />
                 Shadow Intensity
               </Label>
               <span className="text-xs text-muted-foreground font-mono">
                {themeData.shadowIntensity ?? 50}%
               </span>
             </div>
             <Slider
              value={[themeData.shadowIntensity ?? 50]}
              onValueChange={([v]) => updateNumericField(updateField, 'theme.shadowIntensity', v)}
               min={0}
               max={100}
               step={5}
               className="cursor-pointer"
             />
             <div className="flex justify-between text-[10px] text-muted-foreground">
               <span>Flat</span>
               <span>Dramatic</span>
             </div>
           </div>
 
           {/* Animation Speed */}
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <Label className="text-xs flex items-center gap-2">
                 <Zap className="h-3 w-3 text-muted-foreground" />
                 Animation Speed
               </Label>
               <span className="text-xs text-muted-foreground font-mono">
                {themeData.animationSpeed ?? 1}x
               </span>
             </div>
             <Slider
              value={[themeData.animationSpeed ?? 1]}
              onValueChange={([v]) => updateNumericField(updateField, 'theme.animationSpeed', v)}
               min={0.5}
               max={2}
               step={0.1}
               className="cursor-pointer"
             />
             <div className="flex justify-between text-[10px] text-muted-foreground">
               <span>Slow</span>
               <span>Fast</span>
             </div>
           </div>
         </div>
 
         {/* Preset Backgrounds for Linktree */}
         {category === 'linktree' && (
           <div className="space-y-3">
             <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
               Gradient Presets
             </h4>
             <div className="grid grid-cols-4 gap-2">
               {GRADIENT_PRESETS.map((preset, i) => (
                 <button
                   key={i}
                   onClick={() => updateField('theme.background', preset.value)}
                   className="h-10 rounded-lg border-2 border-transparent hover:border-primary transition-all duration-200 hover:scale-105"
                   style={{ background: preset.value }}
                   title={preset.name}
                 />
               ))}
             </div>
           </div>
         )}
       </CardContent>
     </Card>
   );
 }
 
 interface ColorInputProps {
   label: string;
   value: string;
   onChange: (value: string) => void;
   icon?: React.ReactNode;
 }
 
 function ColorInput({ label, value, onChange, icon }: ColorInputProps) {
   const isGradient = value.includes('gradient') || value.includes('linear');
   
   return (
     <div className="space-y-1.5">
       <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
         {icon}
         {label}
       </Label>
       <div className="flex gap-1.5">
         {!isGradient && (
           <Input
             type="color"
             value={value.startsWith('#') ? value : '#ffffff'}
             onChange={(e) => onChange(e.target.value)}
             className="h-8 w-10 cursor-pointer p-0.5 rounded-md"
           />
         )}
         <Input
           value={value}
           onChange={(e) => onChange(e.target.value)}
           placeholder="#ffffff"
           className="h-8 text-xs flex-1"
         />
       </div>
     </div>
   );
 }
 
 const GRADIENT_PRESETS = [
   { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
   { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
   { name: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
   { name: 'Night', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
   { name: 'Fire', value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
   { name: 'Aurora', value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
   { name: 'Rose', value: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)' },
   { name: 'Cosmic', value: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)' },
 ];