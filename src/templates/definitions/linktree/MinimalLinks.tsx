import { LinktreeData } from '@/types/builder';
import { ArrowUpRight, User, Sparkles, Palette, Settings2, Trash2, Plus } from 'lucide-react';
import { EditorProps } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ThemeControls } from '@/components/editor/ThemeControls';
import { BrandKitControls } from '@/components/editor/BrandKitControls';

interface MinimalLinksProps {
  data: LinktreeData;
}

export default function MinimalLinks({ data }: MinimalLinksProps) {
  const { profile, links, theme } = data;
  return (
    <div className="min-h-full w-full py-16 px-6 text-center bg-white text-slate-900" style={{ backgroundColor: theme?.background }}>
      <div className="mx-auto max-w-md">
        {profile?.avatar && (
          <img src={profile.avatar} alt={profile.name} className="h-24 w-24 rounded-full mx-auto mb-4 object-cover border border-slate-200" />
        )}
        <h1 className="text-2xl font-bold mb-1" style={{ color: theme?.textColor }}>{profile?.name || 'Your Name'}</h1>
        <p className="text-slate-500 mb-8" style={{ color: theme?.textColor, opacity: 0.7 }}>{profile?.bio}</p>
        <div className="space-y-3">
          {links?.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between w-full px-6 py-4 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
               style={{ backgroundColor: theme?.buttonColor, color: theme?.buttonTextColor }}>
              <span className="font-medium">{link.title}</span>
              <ArrowUpRight className="h-4 w-4 opacity-40" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MinimalLinksEditor(props: EditorProps) {
    return <NeonGlowEditor {...props} />;
}

// Re-using NeonGlowEditor logic as it's similar for all linktree templates
import { NeonGlowEditor } from './NeonGlow';
