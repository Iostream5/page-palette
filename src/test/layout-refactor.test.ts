import { expect, test } from 'vitest';
import { generateComponentId, createComponentFromPreset } from '../lib/component-presets';

test('generateComponentId creates unique IDs', () => {
  const id1 = generateComponentId();
  const id2 = generateComponentId();
  expect(id1).not.toBe(id2);
  expect(id1).toMatch(/^comp_/);
});

test('createComponentFromPreset creates layout-grid', () => {
  const component = createComponentFromPreset('layout-grid', 1);
  expect(component.type).toBe('layout-grid');
  expect(component.props).toHaveProperty('columns');
  expect(Array.isArray(component.props.children)).toBe(true);
});

test('createComponentFromPreset creates layout-columns', () => {
  const component = createComponentFromPreset('layout-columns', 1);
  expect(component.type).toBe('layout-columns');
  expect(component.props).toHaveProperty('count');
  expect(Array.isArray(component.props.children)).toBe(true);
});
