import { useParams } from 'react-router-dom';
import { usePublicProject } from '@/hooks/useProjects';
import { PreviewRenderer } from '@/components/preview/PreviewRenderer';
import { Loader2 } from 'lucide-react';

export default function PublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = usePublicProject(slug!);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          This page doesn't exist or hasn't been published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PreviewRenderer template={project.template!} data={project.data} />
    </div>
  );
}
