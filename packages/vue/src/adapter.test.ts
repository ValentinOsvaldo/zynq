import { describe, it, expect, vi } from 'vitest';
import { VueRouterAdapter } from './adapter';
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router';

function createMockRouter(): Router {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    currentRoute: {} as any,
    install: () => {},
  } as unknown as Router;
}

function createMockRoute(query: Record<string, string | string[] | undefined> = {}): RouteLocationNormalizedLoaded {
  return {
    query: { ...query },
    path: '/',
    params: {},
    name: undefined,
    matched: [],
    meta: {},
    href: '/',
    fullPath: '/',
  } as unknown as RouteLocationNormalizedLoaded;
}

describe('VueRouterAdapter', () => {
  it('getParams() returns query as Record<string, string | null>', () => {
    const route = createMockRoute({ name: 'Alice', count: '42' });
    const adapter = new VueRouterAdapter(createMockRouter(), route);
    expect(adapter.getParams()).toEqual({ name: 'Alice', count: '42' });
  });

  it('getParams() normalizes array query to first element', () => {
    const route = createMockRoute({ tag: ['a', 'b'] });
    const adapter = new VueRouterAdapter(createMockRouter(), route);
    expect(adapter.getParams()).toEqual({ tag: 'a' });
  });

  it('getParams() returns null for missing keys', () => {
    const route = createMockRoute({ only: 'value' });
    const adapter = new VueRouterAdapter(createMockRouter(), route);
    const params = adapter.getParams();
    expect(params.only).toBe('value');
    expect(params.missing).toBeUndefined();
  });

  it('push() merges current query with new params and calls router.push with full location', () => {
    const router = createMockRouter();
    const route = createMockRoute({ a: '1', b: '2' });
    const adapter = new VueRouterAdapter(router, route);

    adapter.push({ b: 'updated', c: '3' });

    expect(router.push).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/',
        query: { a: '1', b: 'updated', c: '3' },
      }),
    );
  });

  it('replace() merges current query with new params and calls router.replace with full location', () => {
    const router = createMockRouter();
    const route = createMockRoute({ page: '1' });
    const adapter = new VueRouterAdapter(router, route);

    adapter.replace({ page: '2' });

    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/',
        query: { page: '2' },
      }),
    );
  });
});
