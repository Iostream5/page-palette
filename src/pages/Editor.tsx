import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject } from '@/hooks/useProjects';
import { BrandKit } from '@/types/builder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  LayoutGrid,
  Settings,
  Download,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Undo2,
  Redo2,
  Layers,
  Lock,
  Unlock,
  Pencil,
  Trash2,
  EyeOff,
  GripVertical,
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
import { ComponentLibrary } from '@/components/editor/ComponentLibrary';
import { BrandKitControls } from '@/components/editor/BrandKitControls';
import { useHistory } from '@/hooks/useHistory';
import { PageCanvas } from '@/components/editor/PageCanvas';
import { ComponentPropsEditor } from '@/components/editor/ComponentPropsEditor';
import { ExportDialog } from '@/components/editor/ExportDialog';
import { PageComponent } from '@/types/page-components';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Reorder, AnimatePresence as MotionAnimatePresence } from 'framer-motion';

const THEME_PRESETS = [
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    brandKit: {
      primaryColor: '#000000',
      secondaryColor: '#333333',
      accentColor: '#3b82f6',
      fontFamily: 'Inter, sans-serif',
      customCSS: '.custom-builder-content { background: #0a0a0a; min-height: 100vh; color: white; }',
    },
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    brandKit: {
      primaryColor: '#2c1810',
      secondaryColor: '#5c4033',
      accentColor: '#d4af37',
      fontFamily: 'Playfair Display, serif',
    },
  },
  {
    id: 'tech-vibrant',
    name: 'Tech Vibrant',
    brandKit: {
      primaryColor: '#00f2fe',
      secondaryColor: '#4facfe',
      accentColor: '#f093fb',
      fontFamily: 'Space Grotesk, sans-serif',
    },
  },
];

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id!);
  const updateProject = useUpdateProject();

  const [projectName, setProjectName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'components' | 'styles' | 'navigator'>('components');
  
  // History management for all project data
  const {
    state: data,
    setState: setDataHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory
  } = useHistory<Record<string, any>>({});

  const setData = useCallback((newData: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => {
    setDataHistory(newData);
    setHasChanges(true);
  }, [setDataHistory]);

  const pageComponents = (data.pageComponents as PageComponent[]) || [];
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  
  // Determine if this is a custom page builder project
  const isCustomProject = project?.category === 'custom';

  useEffect(() => {
    if (project && Object.keys(data).length === 0) {
      resetHistory(project.data);
      setProjectName(project.name);
      setSlug(project.slug || '');
    }
  }, [project, resetHistory, data]);

  const handleDataChange = useCallback((newData: Record<string, unknown>) => {
    setData(newData);
  }, [setData]);

  // Handle page components changes
  const handleComponentsChange = useCallback((components: PageComponent[]) => {
    setData(prev => ({ ...prev, pageComponents: components }));
  }, [setData]);

  // Add component from library
  const handleAddComponent = useCallback((component: PageComponent) => {
    const updatedComponents = [...pageComponents, component];
    handleComponentsChange(updatedComponents);
    setSelectedComponentId(component.id);
    toast.success(`${component.type} added!`);
  }, [pageComponents, handleComponentsChange]);

  // Update single component
  const handleUpdateComponent = useCallback((updated: PageComponent) => {
    const updatedComponents = pageComponents.map(c => 
      c.id === updated.id ? updated : c
    );
    handleComponentsChange(updatedComponents);
  }, [pageComponents, handleComponentsChange]);

  // Delete component
  const handleDeleteComponent = useCallback((id: string) => {
    const updatedComponents = pageComponents.filter(c => c.id !== id);
    handleComponentsChange(updatedComponents);
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
    toast.success('Component deleted');
  }, [pageComponents, handleComponentsChange, selectedComponentId]);

  // Duplicate component
  const handleDuplicateComponent = useCallback((id: string) => {
    const component = pageComponents.find(c => c.id === id);
    if (!component) return;
    
    const duplicated: PageComponent = {
      ...component,
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      order: pageComponents.length,
    };
    handleComponentsChange([...pageComponents, duplicated]);
    setSelectedComponentId(duplicated.id);
    toast.success('Component duplicated');
  }, [pageComponents, handleComponentsChange]);

  // Get selected component
  const selectedComponent = pageComponents.find(c => c.id === selectedComponentId);

  // Generate CSS Variables for Global Styles
  const globalStyles = data.brandKit ? (
    <style>
      {`
        :root {
          ${data.brandKit.primaryColor ? `--primary: ${data.brandKit.primaryColor};` : ''}
          ${data.brandKit.secondaryColor ? `--secondary: ${data.brandKit.secondaryColor};` : ''}
          ${data.brandKit.accentColor ? `--accent: ${data.brandKit.accentColor};` : ''}
          ${data.brandKit.fontFamily ? `--font-body: ${data.brandKit.fontFamily};` : ''}
        }
        .custom-builder-canvas {
          ${data.brandKit.fontFamily ? `font-family: ${data.brandKit.fontFamily};` : ''}
        }
        ${data.brandKit.customCSS || ''}
      `}
    </style>
  ) : null;

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

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Responsive Toggles */}
        <div className="hidden items-center rounded-lg border border-border bg-muted/50 p-1 md:flex">
          <Button
            variant={deviceMode === 'desktop' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDeviceMode('desktop')}
            title="Desktop View"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={deviceMode === 'tablet' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDeviceMode('tablet')}
            title="Tablet View"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={deviceMode === 'mobile' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDeviceMode('mobile')}
            title="Mobile View"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-muted-foreground">Unsaved changes</span>
          )}
          
          {/* Export Button */}
          <ExportDialog components={pageComponents} projectName={projectName} />
          
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
      {/* Left Panel */}
        <div className="w-96 flex-shrink-0 border-r border-border overflow-hidden flex flex-col">
          {isCustomProject ? (
            // Custom project - tabs for Components and Global Styles
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('components')}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-muted/50",
                    activeTab === 'components'
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Components
                </button>
                <button
                  onClick={() => setActiveTab('styles')}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-muted/50",
                    activeTab === 'styles'
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Palette className="h-4 w-4" />
                  Global Styles
                </button>
                <button
                  onClick={() => setActiveTab('navigator')}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-muted/50",
                    activeTab === 'navigator'
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Layers className="h-4 w-4" />
                  Navigator
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                {activeTab === 'components' ? (
                  <ComponentLibrary
                    onAddComponent={handleAddComponent}
                    existingComponentCount={pageComponents.length}
                  />
                ) : activeTab === 'styles' ? (
                  <div className="h-full overflow-auto p-4 space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Theme Presets</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {THEME_PRESETS.map((preset) => (
                          <Button
                            key={preset.id}
                            variant="outline"
                            className="justify-start gap-3 h-auto py-3 px-4"
                            onClick={() => {
                              setData(prev => ({ ...prev, brandKit: preset.brandKit }));
                              toast.success(`Applied ${preset.name} theme`);
                            }}
                          >
                            <Palette className="h-4 w-4" style={{ color: (preset.brandKit as any).accentColor }} />
                            <div className="text-left">
                              <div className="text-sm font-medium">{preset.name}</div>
                              <div className="text-[10px] text-muted-foreground">{(preset.brandKit as any).fontFamily.split(',')[0]}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <BrandKitControls
                      brandKit={(data.brandKit as BrandKit) || {}}
                      onChange={(brandKit) => {
                        setData(prev => ({ ...prev, brandKit }));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-full overflow-auto p-4">
                    <div className="mb-4 text-sm font-medium flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Page Navigator
                    </div>
                    <div className="space-y-2">
                      <Reorder.Group
                        axis="y"
                        values={pageComponents.sort((a, b) => a.order - b.order)}
                        onReorder={(newOrder) => {
                          const updated = newOrder.map((c, i) => ({ ...c, order: i }));
                          handleComponentsChange(updated);
                        }}
                        className="space-y-2"
                      >
                        <MotionAnimatePresence>
                          {pageComponents.map((comp) => (
                            <Reorder.Item
                              key={comp.id}
                              value={comp}
                              className="relative"
                            >
                              <div
                                onClick={() => setSelectedComponentId(comp.id)}
                                className={cn(
                                  "group flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer transition-colors bg-card",
                                  selectedComponentId === comp.id ? "bg-primary/10 border-primary" : "hover:bg-accent",
                                  (comp as any).locked && "opacity-80"
                                )}
                              >
                                <div className="flex items-center gap-2 overflow-hidden flex-1">
                                  <GripVertical className="h-3 w-3 text-muted-foreground shrink-0 cursor-grab active:cursor-grabbing" />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium capitalize truncate">
                                      {(comp as any).customName || comp.type.replace('-', ' ')}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground uppercase">{comp.type}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const name = prompt("Enter component name:", (comp as any).customName || "");
                                      if (name !== null) {
                                        const updated = pageComponents.map(c =>
                                          c.id === comp.id ? { ...c, customName: name } : c
                                        );
                                        handleComponentsChange(updated);
                                      }
                                    }}
                                    title="Rename"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = pageComponents.map(c =>
                                        c.id === comp.id ? { ...c, locked: !(c as any).locked } : c
                                      );
                                      handleComponentsChange(updated);
                                    }}
                                    title={(comp as any).locked ? "Unlock" : "Lock"}
                                  >
                                    {(comp as any).locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = pageComponents.map(c =>
                                        c.id === comp.id ? { ...c, visible: !c.visible } : c
                                      );
                                      handleComponentsChange(updated);
                                    }}
                                    title={comp.visible ? "Hide" : "Show"}
                                  >
                                    {comp.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteComponent(comp.id);
                                    }}
                                    title="Delete"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </Reorder.Item>
                          ))}
                        </MotionAnimatePresence>
                      </Reorder.Group>
                      {pageComponents.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-8">
                          No components yet. Add some to see them here.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Template project - content editor only, no components tab
            <div className="flex-1 overflow-auto p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Settings className="h-4 w-4" />
                Content
              </div>
              <EditorForm
                template={project.template!}
                data={data}
                onChange={handleDataChange}
              />
            </div>
          )}
        </div>

        {isCustomProject ? (
          <>
            {/* Center - Page Canvas */}
            <div className="flex-1 overflow-auto bg-muted/30 border-r border-border">
              {globalStyles}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <LayoutGrid className="h-4 w-4" />
                  Page Builder
                </div>
                <div
                  className={cn(
                    "mx-auto min-h-[calc(100vh-12rem)] rounded-lg border border-border bg-background shadow-sm transition-all duration-300",
                    deviceMode === 'desktop' && 'w-full',
                    deviceMode === 'tablet' && 'w-[768px]',
                    deviceMode === 'mobile' && 'w-[375px]'
                  )}
                >
                  <div className="custom-builder-canvas h-full">
                    <PageCanvas
                      components={pageComponents}
                      onComponentsChange={handleComponentsChange}
                      onSelectComponent={setSelectedComponentId}
                      selectedComponentId={selectedComponentId}
                      deviceMode={deviceMode}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Props Editor */}
            {selectedComponent && (
              <div className="w-80 flex-shrink-0 border-l border-border">
                <ComponentPropsEditor
                  component={selectedComponent}
                  onUpdate={handleUpdateComponent}
                  onDelete={() => handleDeleteComponent(selectedComponent.id)}
                  onDuplicate={() => handleDuplicateComponent(selectedComponent.id)}
                  onClose={() => setSelectedComponentId(null)}
                  deviceMode={deviceMode}
                />
              </div>
            )}
          </>
        ) : (
          // Template project - preview only
          <div className="flex-1 overflow-auto p-4 bg-muted/30">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              Preview
            </div>
            <div
              className={cn(
                "mx-auto min-h-[calc(100vh-12rem)] overflow-auto rounded-lg border border-border bg-white shadow-lg transition-all duration-300",
                deviceMode === 'desktop' && 'w-full',
                deviceMode === 'tablet' && 'w-[768px]',
                deviceMode === 'mobile' && 'w-[375px]'
              )}
            >
              <PreviewRenderer template={project.template!} data={data} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
