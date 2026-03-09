import { Router, RouteLocationNormalizedLoaded } from 'vue-router';
import type { Router as ZynqRouter } from '@zynq/core';

export class VueRouterAdapter implements ZynqRouter {
  constructor(
    private router: Router,
    private route: RouteLocationNormalizedLoaded,
  ) {}

  getParams(): Record<string, string | null> {
    const query = this.route.query;
    const out: Record<string, string | null> = {};
    for (const key in query) {
      const v = query[key];
      out[key] = Array.isArray(v) ? (v[0] ?? null) : (v ?? null);
    }
    return out;
  }

  private toLocation(params: Record<string, string | null>) {
    const query: Record<string, string | string[]> = {};
    for (const key in this.route.query) {
      const v = this.route.query[key];
      if (v != null && v !== '') query[key] = v as string | string[];
    }
    for (const key in params) {
      const v = params[key];
      if (v === null) delete query[key];
      else query[key] = v;
    }
    const location: {
      path: string;
      name?: string;
      params: Record<string, string | string[]>;
      query: Record<string, string | string[]>;
      hash?: string;
    } = {
      path: this.route.path,
      params: this.route.params as Record<string, string | string[]>,
      query,
    };
    if (this.route.name != null) location.name = this.route.name as string;
    if (this.route.hash) location.hash = this.route.hash;
    return location;
  }

  push(params: Record<string, string | null>) {
    this.router.push(this.toLocation(params));
  }

  replace(params: Record<string, string | null>) {
    this.router.replace(this.toLocation(params));
  }
  
}
