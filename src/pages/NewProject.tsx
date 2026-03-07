import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplates, useCreateProject } from '@/hooks/useProjects';
import { CATEGORIES, Template, TemplateCategory } from '@/types/builder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'category' | 'template' | 'name';

export default function NewProject() {
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [projectName, setProjectName] = useState('');
  const [creating, setCreating] = useState(false);

  const { data: templates, isLoading: templatesLoading } = useTemplates(selectedCategory ?? undefined);
  const createProject = useCreateProject();
  const navigate = useNavigate();

  const handleCategorySelect = async (category: TemplateCategory) => {
    setSelectedCategory(category);
    setSelectedTemplate(null);
    setStep('template');
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setStep('name');
    setProjectName(`My ${template.name}`);
  };

  const handleCreate = async () => {
    if (!selectedCategory || !projectName.trim()) return;
    
    // For custom category, we need to fetch the custom template
    if (selectedCategory === 'custom' && !selectedTemplate) {
      setCreating(true);
      try {
        // Fetch the custom template
        const { data: customTemplates } = await import('@/integrations/supabase/client').then(m => 
          m.supabase.from('templates').select('*').eq('category', 'custom').limit(1)
        );
        
        if (!customTemplates || customTemplates.length === 0) {
          toast.error('Custom template not found');
          setCreating(false);
          return;
        }
        
        const customTemplate = customTemplates[0];
        const project = await createProject.mutateAsync({
          templateId: customTemplate.id,
          category: selectedCategory,
          name: projectName.trim(),
          data: customTemplate.default_data || { pageComponents: [] },
        });
        toast.success('Project created!');
        navigate(`/edit/${project.id}`);
      } catch {
        toast.error('Failed to create project');
      } finally {
        setCreating(false);
      }
      return;
    }

    if (!selectedTemplate) return;

    setCreating(true);
    try {
      const project = await createProject.mutateAsync({
        templateId: selectedTemplate.id,
        category: selectedCategory,
        name: projectName.trim(),
        data: selectedTemplate.default_data,
      });
      toast.success('Project created!');
      navigate(`/edit/${project.id}`);
    } catch {
      toast.error('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const goBack = () => {
    if (step === 'template') {
      setStep('category');
      setSelectedCategory(null);
    } else if (step === 'name') {
      // For custom category, go back to category selection
      if (selectedCategory === 'custom') {
        setStep('category');
        setSelectedCategory(null);
      } else {
        setStep('template');
        setSelectedTemplate(null);
      }
    }
  };

  // Determine which steps to show based on category
  const getSteps = () => {
    if (selectedCategory === 'custom') {
      return ['category', 'name'];
    }
    return ['category', 'template', 'name'];
  };
  
  const steps = getSteps();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Create New Project</h1>
            <p className="text-sm text-muted-foreground">
              {step === 'category' && 'Choose a category'}
              {step === 'template' && 'Pick a template'}
              {step === 'name' && 'Name your project'}
            </p>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : steps.indexOf(step) > i
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {steps.indexOf(step) > i ? (
                  <Check className="h-3 w-3" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  'text-sm capitalize',
                  step === s ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {s}
              </span>
              {i < steps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground/50" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Category Selection */}
        {step === 'category' && (
          <div className="animate-fade-in">
            <h2 className="mb-6 text-xl font-semibold">What do you want to create?</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    'category-card',
                    selectedCategory === category.id && 'selected'
                  )}
                >
                  <div className="mb-3 text-4xl">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Selection */}
        {step === 'template' && (
          <div className="animate-fade-in">
            <div className="mb-6 flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h2 className="text-xl font-semibold">Choose a template</h2>
            </div>

            {templatesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {templates?.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={cn(
                      'template-card p-6',
                      selectedTemplate?.id === template.id && 'selected'
                    )}
                  >
                    <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary/50">
                      <span className="text-4xl opacity-50">
                        {template.category === 'linktree' && '🔗'}
                        {template.category === 'gallery' && '🖼️'}
                        {template.category === 'letter' && '📝'}
                        {template.category === 'custom' && '🎨'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Name */}
        {step === 'name' && (
          <div className="animate-fade-in">
            <div className="mb-6 flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h2 className="text-xl font-semibold">Name your project</h2>
            </div>

            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Project Name</CardTitle>
                <CardDescription>
                  Give your project a memorable name. You can change it later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My awesome page"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={!projectName.trim() || creating}
                  className="w-full"
                >
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
