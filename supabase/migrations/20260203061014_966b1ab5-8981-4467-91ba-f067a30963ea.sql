-- Create enum for project status
CREATE TYPE project_status AS ENUM ('draft', 'published');

-- Create enum for template categories
CREATE TYPE template_category AS ENUM ('linktree', 'gallery', 'letter');

-- Create templates table (system templates)
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category template_category NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  schema JSONB NOT NULL,
  default_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Templates are public (read-only for everyone)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by everyone"
ON public.templates
FOR SELECT
USING (true);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.templates(id),
  category template_category NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  slug TEXT UNIQUE,
  status project_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users can view their own projects
CREATE POLICY "Users can view their own projects"
ON public.projects
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own projects
CREATE POLICY "Users can create their own projects"
ON public.projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update their own projects"
ON public.projects
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own projects"
ON public.projects
FOR DELETE
USING (auth.uid() = user_id);

-- Public can view published projects by slug
CREATE POLICY "Anyone can view published projects"
ON public.projects
FOR SELECT
USING (status = 'published' AND slug IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster slug lookups
CREATE INDEX idx_projects_slug ON public.projects(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_templates_category ON public.templates(category);