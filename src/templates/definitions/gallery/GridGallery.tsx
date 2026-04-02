import { GalleryData } from '@/types/builder';
import { Camera } from 'lucide-react';
import { EditorProps } from '../../types';
import { MasonryDarkEditor } from './MasonryDark';

interface GridGalleryProps {
  data: GalleryData;
}

export default function GridGallery({ data }: GridGalleryProps) {
  const { header, photos, theme } = data;
  return (
    <div className="min-h-full w-full py-12 px-6 bg-slate-50" style={{ backgroundColor: theme?.background }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Camera className="h-8 w-8 mx-auto mb-4 text-slate-400" />
          <h1 className="text-3xl font-bold text-slate-900">{header?.title || 'Gallery'}</h1>
          <p className="text-slate-500 mt-2">{header?.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos?.map((photo, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-xl shadow-md bg-white border border-slate-100">
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              {photo.caption && (
                  <div className="p-3 bg-white">
                      <p className="text-sm font-medium truncate">{photo.caption}</p>
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GridGalleryEditor(props: EditorProps) {
    return <MasonryDarkEditor {...props} />;
}
