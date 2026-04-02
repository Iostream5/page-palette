import { LinktreeData } from '@/types/builder';
import { ArrowUpRight } from 'lucide-react';
import { EditorProps } from '../../types';
import { NeonGlowEditor } from './NeonGlow';

interface GradientLinksProps {
  data: LinktreeData;
}

export default function GradientLinks({ data }: GradientLinksProps) {
  const { profile, links, theme } = data;
  return (
    <div className="min-h-full w-full py-16 px-6 text-center"
         style={{ background: theme?.background || 'linear-gradient(to bottom, #6366f1, #a855f7)' }}>
      <div className="mx-auto max-w-md text-white">
        {profile?.avatar && (
          <img src={profile.avatar} alt={profile.name} className="h-24 w-24 rounded-full mx-auto mb-4 object-cover border-2 border-white/50 shadow-xl" />
        )}
        <h1 className="text-2xl font-bold mb-1">{profile?.name || 'Your Name'}</h1>
        <p className="opacity-80 mb-8">{profile?.bio}</p>
        <div className="space-y-4">
          {links?.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all shadow-lg group">
              <span className="font-semibold">{link.title}</span>
              <ArrowUpRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GradientLinksEditor(props: EditorProps) {
    return <NeonGlowEditor {...props} />;
}
