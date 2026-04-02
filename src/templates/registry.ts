import { TemplateDefinition } from './types';
import * as Linktree from './linktree';
import * as Gallery from './gallery';
import * as Letter from './letter';

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  // Linktree
  '7c314643-98f4-4514-b27e-e0b4b5c9de6a': Linktree.MinimalLinks,
  '22dd00ad-40c2-425e-9801-83af98e3d35d': Linktree.GradientLinks,
  '63130804-b376-4595-9ca4-1e593a6160b4': Linktree.NeonGlow,
  'a340ac35-637a-4cb0-b09b-d1968f736824': Linktree.Glassmorphism,
  '42642365-cc84-4e38-a56f-edb7c1b528cb': Linktree.RetroWave,

  // Gallery
  '5ec04c82-dc19-4c31-bbca-eb368c446cb2': Gallery.GridGallery,
  '6c086b2b-9a45-4f5a-828a-9bb29b6a1bf8': Gallery.MasonryGallery,
  '205aeef9-55e5-4e65-8962-41aa88f24ad3': Gallery.MasonryDark,
  'be7bb547-7f8c-4c4a-b179-5d4e544ac5bf': Gallery.PolaroidStack,
  '1fbf479a-e646-4184-b6a4-2bfcb76d627b': Gallery.FilmStrip,

  // Letter
  '7e025846-b69e-465e-9189-311c5522be3b': Letter.ClassicLetter,
  '4c02dcad-7c0f-461c-a316-eed9e8783a8d': Letter.ModernDocument,
  '22a3307f-176e-48a1-9b8d-72d0912a71d9': Letter.Typewriter,
  '6ef8263b-63e2-46a0-9350-dd3dae021f3c': Letter.LoveLetter,
  '3f2c0228-1917-40b0-82f0-f469324b3774': Letter.OfficialDocument,
};

export function getTemplateDefinition(id: string): TemplateDefinition | undefined {
  return TEMPLATE_REGISTRY[id];
}

export function getAllTemplates(): TemplateDefinition[] {
  return Object.values(TEMPLATE_REGISTRY);
}

export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return getAllTemplates().filter(t => t.category === category);
}
