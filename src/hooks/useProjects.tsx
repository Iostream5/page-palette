import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project, Template, TemplateCategory, ProjectStatus } from '@/types/builder';
import { useAuth } from './useAuth';
import type { Json } from '@/integrations/supabase/types';
import { getAllTemplates, getTemplateById, getTemplatesByCategory } from '@/templates/registry';
import { LocalTemplate } from '@/templates/types';

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

function mapLocalTemplate(template: LocalTemplate): Template {
  return {
    id: template.id,
    name: template.name,
    category: template.category,
    description: template.description,
    thumbnail_url: template.thumbnail_url || null,
    schema: template.schema || { sections: [] },
    default_data: template.default_data as Record<string, unknown>,
    created_at: new Date().toISOString(),
  };
}

function resolveTemplate(templateId: string): Template | undefined {
  const localTemplate = getTemplateById(templateId);
  return localTemplate ? mapLocalTemplate(localTemplate) : undefined;
}

function mapProject(p: DatabaseProject): Project {
  return {
    ...p,
    category: p.category as TemplateCategory,
    status: p.status as ProjectStatus,
    data: p.data as Record<string, unknown>,
    template: resolveTemplate(p.template_id),
  };
}

export function useTemplates(category?: TemplateCategory) {
  return useQuery({
    queryKey: ['templates', category],
    queryFn: async () => {
      const localTemplates = category ? getTemplatesByCategory(category) : getAllTemplates();
      return localTemplates.map(mapLocalTemplate);
    },
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const local = resolveTemplate(id);
      if (!local) throw new Error(`Template not found for id: ${id}`);
      return local;
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
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data as DatabaseProject[]).map(mapProject);
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
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return mapProject(data as DatabaseProject);
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
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      if (error) throw error;
      return mapProject(data as DatabaseProject);
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
