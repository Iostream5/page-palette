import { TemplateRegistry } from './types';
import neonGlow from './definitions/linktree/neon-glow';
import glassmorphism from './definitions/linktree/glassmorphism';
import retroWave from './definitions/linktree/retro-wave';
import masonryDark from './definitions/gallery/masonry-dark';
import classicLetter from './definitions/letter/classic-letter';
import standardCustom from './definitions/custom/standard-custom';

export const templateRegistry: TemplateRegistry = {
  [neonGlow.id]: neonGlow,
  [glassmorphism.id]: glassmorphism,
  [retroWave.id]: retroWave,
  [masonryDark.id]: masonryDark,
  [classicLetter.id]: classicLetter,
  [standardCustom.id]: standardCustom,
};

export function getTemplateById(id: string) {
  if (templateRegistry[id]) return templateRegistry[id];
  return Object.values(templateRegistry).find(
    (t) => t.legacyIds?.includes(id) || t.name === id || t.id === id
  );
}

export function getAllTemplates() {
  return Object.values(templateRegistry);
}

export function getTemplatesByCategory(category: string) {
  return Object.values(templateRegistry).filter((t) => t.category === category);
}
