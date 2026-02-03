import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Loader2,
  Save,
  Globe,
  Eye,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EditorForm } from '@/components/editor/EditorForm';
import { PreviewRenderer } from '@/components/preview/PreviewRenderer';
import { cn } from '@/lib/utils';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id!);
  const updateProject = useUpdateProject();

  const [data, setData] = useState<Record<string, unknown>>({});
  const [projectName, setProjectName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project) {
      setData(project.data);
      setProjectName(project.name);
      setSlug(project.slug || '');
    }
  }, [project]);

  const handleDataChange = useCallback((newData: Record<string, unknown>) => {
    setData(newData);
    setHasChanges(true);
  }, []);

  // Autosave with debounce
  useEffect(() => {
    if (!hasChanges || !id) return;

    const timer = setTimeout(async () => {
      try {
        await updateProject.mutateAsync({ id, data });
        setHasChanges(false);
      } catch {
        // Silent fail for autosave
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [data, hasChanges, id, updateProject]);

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await updateProject.mutateAsync({ id, data, name: projectName });
      setHasChanges(false);
      toast.success('Saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = () => {
    const baseSlug = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;
    setSlug(uniqueSlug);
  };

  const handlePublish = async () => {
    if (!id || !slug.trim()) {
      toast.error('Please enter a URL slug');
      return;
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error('Slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    try {
      await updateProject.mutateAsync({ id, slug, status: 'published', data });
      toast.success('Published successfully!');
      setPublishDialogOpen(false);
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (err.message?.includes('duplicate')) {
        toast.error('This URL is already taken. Please choose another.');
      } else {
        toast.error('Failed to publish');
      }
    }
  };

  const handleUnpublish = async () => {
    if (!id) return;
    try {
      await updateProject.mutateAsync({ id, status: 'draft' });
      toast.success('Unpublished');
    } catch {
      toast.error('Failed to unpublish');
    }
  };

  const copyPublicUrl = () => {
    const url = `${window.location.origin}/p/${project?.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const publicUrl = project.slug ? `${window.location.origin}/p/${project.slug}` : null;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <Input
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setHasChanges(true);
              }}
              className="h-8 border-transparent bg-transparent px-2 text-lg font-semibold hover:border-input focus:border-input"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-muted-foreground">Unsaved changes</span>
          )}
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>

          {project.status === 'published' && publicUrl ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyPublicUrl}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View
                </a>
              </Button>
              <Button variant="secondary" size="sm" onClick={handleUnpublish}>
                Unpublish
              </Button>
            </div>
          ) : (
            <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Globe className="mr-2 h-4 w-4" />
                  Publish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Publish Your Page</DialogTitle>
                  <DialogDescription>
                    Choose a unique URL for your public page
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>URL Slug</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                        /p/
                      </div>
                      <Input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase())}
                        placeholder="my-page"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Only lowercase letters, numbers, and hyphens
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={generateSlug}>
                    Generate Random Slug
                  </Button>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setPublishDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handlePublish}>
                      Publish
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Editor Form */}
        <div className="w-96 flex-shrink-0 border-r border-border editor-panel">
          <div className="p-4">
            <h3 className="mb-4 font-semibold text-foreground">Edit Content</h3>
            <EditorForm
              template={project.template!}
              data={data}
              onChange={handleDataChange}
            />
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 preview-panel">
          <div className="h-full w-full max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              Preview
            </div>
            <div className="h-[calc(100%-2rem)] overflow-auto rounded-lg border border-border bg-white shadow-lg">
              <PreviewRenderer template={project.template!} data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
