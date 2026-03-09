import { Codec } from '../schema';
import { Router } from './router';

export type Schema = Record<string, Codec<any>>;

export type InferState<S extends Schema> = {
  [K in keyof S]: S[K] extends Codec<infer T> ? T : never;
};

export class SynqEngine<S extends Schema> {
  constructor(
    private readonly schema: S,
    private readonly router: Router,
  ) {}

  public parse(): InferState<S> {
    const params = this.router.getParams();
    const state = {} as any;

    for (const key in this.schema) {
      const codec = this.schema[key];
      const rawValue = params[key];

      const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

      state[key] = codec.decode(value);
    }

    return state;
  }

  public serialize(
    state: Partial<InferState<S>>,
  ): Record<string, string | null> {
    const query: Record<string, string | null> = {};
    for (const key in this.schema) {
      const codec = this.schema[key];
      const val = state[key];
      query[key] = val === codec.defaultValue ? null : codec.encode(val);
    }
    return query;
  }

  public commit(
    newState: Partial<InferState<S>>,
    mode: 'push' | 'replace' = 'replace',
  ): void {
    const currentParams = this.router.getParams();
    const newParams: Record<string, string | null> = {};

    for (const key in this.schema) {
      const codec = this.schema[key];

      if (key in newState) {
        const val = newState[key];
        newParams[key] = val === codec.defaultValue ? null : codec.encode(val);
      }
    }

    this.router[mode]({ ...currentParams, ...newParams });
  }
}
