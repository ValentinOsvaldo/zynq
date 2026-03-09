import {
  ArrayCodec,
  BooleanCodec,
  Codec,
  DateCodec,
  NumberCodec,
  StringCodec,
} from './codec';

export const s = {
  string: (defaultValue = '') => new StringCodec(defaultValue),
  number: (defaultValue = 0) => new NumberCodec(defaultValue),
  boolean: (defaultValue = false) => new BooleanCodec(defaultValue),
  date: (defaultValue = new Date()) => new DateCodec(defaultValue),
  array: <T>(innerCodec: Codec<T>, defaultValue: T[] = []) =>
    new ArrayCodec(innerCodec, defaultValue),
};

export type AnyCodec = Codec<any>;

export type Schema = Record<string, AnyCodec>;

export type InferSchema<S extends Schema> = {
  [K in keyof S]: S[K] extends Codec<infer T> ? T : never;
};
