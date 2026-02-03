import { Template, LinktreeData, GalleryData, LetterData } from '@/types/builder';

interface PreviewRendererProps {
  template: Template;
  data: Record<string, unknown>;
}

export function PreviewRenderer({ template, data }: PreviewRendererProps) {
  if (template.category === 'linktree') {
    return <LinktreePreview data={data as unknown as LinktreeData} />;
  }

  if (template.category === 'gallery') {
    return <GalleryPreview data={data as unknown as GalleryData} />;
  }

  if (template.category === 'letter') {
    return <LetterPreview data={data as unknown as LetterData} />;
  }

  return null;
}

function LinktreePreview({ data }: { data: LinktreeData }) {
  const { profile, links, theme } = data;

  const backgroundStyle = theme?.background?.includes('gradient')
    ? { background: theme.background }
    : { backgroundColor: theme?.background || '#ffffff' };

  return (
    <div
      className="min-h-full w-full px-4 py-12"
      style={{
        ...backgroundStyle,
        color: theme?.textColor || '#1a1a1a',
      }}
    >
      <div className="mx-auto max-w-md text-center">
        {/* Avatar */}
        {profile?.avatar && (
          <div className="mb-4 flex justify-center">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-white/20"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Name & Bio */}
        <h1 className="text-2xl font-bold">{profile?.name || 'Your Name'}</h1>
        {profile?.bio && (
          <p className="mt-2 text-sm opacity-80">{profile.bio}</p>
        )}

        {/* Links */}
        <div className="mt-8 space-y-3">
          {(links || []).map((link, index) => (
            <a
              key={index}
              href={link.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg px-4 py-3 text-center font-medium transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: theme?.buttonColor || '#1a1a1a',
                color: theme?.buttonTextColor || '#ffffff',
              }}
            >
              {link.title || 'Untitled Link'}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryPreview({ data }: { data: GalleryData }) {
  const { header, photos, theme } = data;

  return (
    <div
      className="min-h-full w-full px-4 py-12"
      style={{
        backgroundColor: theme?.background || '#f8f9fa',
        color: theme?.textColor || '#1a1a1a',
      }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{header?.title || 'My Gallery'}</h1>
          {header?.description && (
            <p className="mt-2 text-sm opacity-70">{header.description}</p>
          )}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {(photos || []).map((photo, index) =>
            photo.url ? (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg bg-black/10"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
                      '<div class="flex h-full items-center justify-center text-sm opacity-50">Image not found</div>';
                  }}
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm">{photo.caption}</p>
                  </div>
                )}
              </div>
            ) : (
              <div
                key={index}
                className="flex aspect-square items-center justify-center rounded-lg bg-black/5 text-sm opacity-50"
              >
                No image
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function LetterPreview({ data }: { data: LetterData }) {
  const { letter, document: doc, theme } = data;

  const fontFamily = theme?.fontFamily === 'serif' ? 'Georgia, serif' : 'inherit';

  if (letter) {
    return (
      <div
        className="min-h-full w-full px-4 py-12"
        style={{
          backgroundColor: theme?.background || '#faf7f2',
          color: theme?.textColor || '#2d2d2d',
          fontFamily,
        }}
      >
        <div className="mx-auto max-w-2xl">
          {/* Title */}
          <h1 className="mb-2 text-center text-3xl font-semibold">
            {letter.title || 'A Letter'}
          </h1>
          {letter.date && (
            <p className="mb-8 text-center text-sm opacity-60">{letter.date}</p>
          )}

          {/* Letter Body */}
          <div className="space-y-6">
            <p className="text-lg">{letter.greeting || 'Dear Reader,'}</p>
            <div className="whitespace-pre-wrap leading-relaxed">
              {letter.body || 'Your letter content goes here...'}
            </div>
            <div className="pt-4">
              <p>{letter.closing || 'Sincerely,'}</p>
              <p className="mt-2 font-medium">{letter.signature || 'Your Name'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (doc) {
    return (
      <div
        className="min-h-full w-full px-4 py-12"
        style={{
          backgroundColor: theme?.background || '#ffffff',
          color: theme?.textColor || '#1a1a1a',
          fontFamily,
        }}
      >
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <h1 className="mb-2 text-4xl font-bold">{doc.title || 'Document Title'}</h1>
          {doc.subtitle && (
            <p className="mb-2 text-lg opacity-70">{doc.subtitle}</p>
          )}
          {doc.author && (
            <p className="mb-8 text-sm opacity-50">By {doc.author}</p>
          )}

          {/* Content */}
          <div className="whitespace-pre-wrap leading-relaxed">
            {doc.content || 'Your document content goes here...'}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
