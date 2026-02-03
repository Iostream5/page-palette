import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project, Template, TemplateCategory, ProjectStatus, TemplateSchema } from '@/types/builder';
import { useAuth } from './useAuth';
import type { Json } from '@/integrations/supabase/types';

interface DatabaseProject {
  id: string;
  user_id: string;
  template_id: string;
  category: string;
  name: string;
  data: unknown;
  slug: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseTemplate {
  id: string;
  name: string;
  category: string;
  description: string | null;
  thumbnail_url: string | null;
  schema: unknown;
  default_data: unknown;
  created_at: string;
}

function mapTemplate(t: DatabaseTemplate): Template {
  return {
    ...t,
    category: t.category as TemplateCategory,
    schema: t.schema as TemplateSchema,
    default_data: t.default_data as Record<string, unknown>,
  };
}

function mapProject(p: DatabaseProject, template?: DatabaseTemplate): Project {
  return {
    ...p,
    category: p.category as TemplateCategory,
    status: p.status as ProjectStatus,
    data: p.data as Record<string, unknown>,
    template: template ? mapTemplate(template) : undefined,
  };
}

export function useTemplates(category?: TemplateCategory) {
  return useQuery({
    queryKey: ['templates', category],
    queryFn: async () => {
      let query = supabase.from('templates').select('*');
      if (category) {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data as DatabaseTemplate[]).map(mapTemplate);
    },
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return mapTemplate(data as DatabaseTemplate);
    },
    enabled: !!id,
  });
}

export function useProjects() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, templates(*)')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data as (DatabaseProject & { templates: DatabaseTemplate })[]).map((p) =>
        mapProject(p, p.templates)
      );
    },
    enabled: !!user,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, templates(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      const p = data as DatabaseProject & { templates: DatabaseTemplate };
      return mapProject(p, p.templates);
    },
    enabled: !!id,
  });
}

export function usePublicProject(slug: string) {
  return useQuery({
    queryKey: ['public-project', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, templates(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      if (error) throw error;
      const p = data as DatabaseProject & { templates: DatabaseTemplate };
      return mapProject(p, p.templates);
    },
    enabled: !!slug,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      templateId,
      category,
      name,
      data,
    }: {
      templateId: string;
      category: TemplateCategory;
      name: string;
      data: Record<string, unknown>;
    }) => {
      const { data: project, error } = await supabase
        .from('projects')
        .insert([{
          user_id: user!.id,
          template_id: templateId,
          category,
          name,
          data: data as Json,
        }])
        .select()
        .single();
      if (error) throw error;
      return project as DatabaseProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      name,
      slug,
      status,
    }: {
      id: string;
      data?: Record<string, unknown>;
      name?: string;
      slug?: string;
      status?: ProjectStatus;
    }) => {
      const updates: Record<string, Json | string> = {};
      if (data !== undefined) updates.data = data as Json;
      if (name !== undefined) updates.name = name;
      if (slug !== undefined) updates.slug = slug;
      if (status !== undefined) updates.status = status;

      const { data: project, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return project as DatabaseProject;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
