import { describe, it, expect, vi } from 'vitest';
import { ZynqEngine } from './engine';
import { s } from '../schema/builder';
import type { Router } from './router';

function createMockRouter(initial: Record<string, string | null> = {}): Router {
  let params = { ...initial };
  return {
    getParams: vi.fn(() => ({ ...params })),
    push: vi.fn((next: Record<string, string | null>) => {
      params = { ...params, ...next };
    }),
    replace: vi.fn((next: Record<string, string | null>) => {
      params = { ...params, ...next };
    }),
  };
}

describe('ZynqEngine', () => {
  it('parse(): reads params and decodes with schema', () => {
    const router = createMockRouter({ name: 'Alice', count: '42' });
    const schema = {
      name: s.string(),
      count: s.number(0),
    };
    const engine = new ZynqEngine(schema, router);

    const state = engine.parse();

    expect(state).toEqual({ name: 'Alice', count: 42 });
    expect(router.getParams).toHaveBeenCalled();
  });

  it('parse(): uses default when param missing', () => {
    const router = createMockRouter({ name: 'Bob' });
    const schema = {
      name: s.string(),
      count: s.number(10),
    };
    const engine = new ZynqEngine(schema, router);

    const state = engine.parse();

    expect(state).toEqual({ name: 'Bob', count: 10 });
  });

  it('parse(): uses first element when param is array (e.g. query multi)', () => {
    const router = createMockRouter({ tag: ['v1', 'v2'] } as any);
    const schema = { tag: s.string() };
    const engine = new ZynqEngine(schema, router);

    const state = engine.parse();

    expect(state.tag).toBe('v1');
  });

  it('commit(): encodes and replace by default', () => {
    const router = createMockRouter({ name: 'Old', count: '1' });
    const schema = {
      name: s.string(),
      count: s.number(0),
    };
    const engine = new ZynqEngine(schema, router);

    engine.commit({ name: 'New', count: 2 });

    expect(router.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New',
        count: '2',
      }),
    );
    expect(router.push).not.toHaveBeenCalled();
  });

  it('commit(): uses push when mode is push', () => {
    const router = createMockRouter({ page: '1' });
    const schema = { page: s.number(1) };
    const engine = new ZynqEngine(schema, router);

    engine.commit({ page: 2 }, 'push');

    expect(router.push).toHaveBeenCalledWith(
      expect.objectContaining({ page: '2' }),
    );
  });

  it('commit(): sets param to null when value equals codec default', () => {
    const router = createMockRouter({ name: 'Alice', count: '5' });
    const schema = {
      name: s.string(''),
      count: s.number(0),
    };
    const engine = new ZynqEngine(schema, router);

    engine.commit({ name: '', count: 0 });

    expect(router.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        name: null,
        count: null,
      }),
    );
  });

  it('commit(): merges new state with current params', () => {
    const router = createMockRouter({ a: '1', b: '2' });
    const schema = { a: s.string(), b: s.string() };
    const engine = new ZynqEngine(schema, router);

    engine.commit({ b: 'updated' });

    expect(router.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        a: '1',
        b: 'updated',
      }),
    );
  });
});
