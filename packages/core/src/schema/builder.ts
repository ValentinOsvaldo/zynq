import {
  ArrayCodec,
  BooleanCodec,
  Codec,
  DateCodec,
  NumberCodec,
  ObjectCodec,
  StringCodec,
} from './codec';

export const s = {
  string: (defaultValue = '') => new StringCodec(defaultValue),
  number: (defaultValue = 0) => new NumberCodec(defaultValue),
  boolean: (defaultValue = false) => new BooleanCodec(defaultValue),
  date: (defaultValue = new Date()) => new DateCodec(defaultValue),
  array: <T>(innerCodec: Codec<T>, defaultValue: T[] = []) =>
    new ArrayCodec(innerCodec, defaultValue),
  object: <S extends Schema>(shape: S) => new ObjectCodec(shape),
};

export type AnyCodec = Codec<any>;

export type Schema = Record<string, AnyCodec>;

export type InferSchema<S extends Schema> = {
  [K in keyof S]: S[K] extends Codec<infer T> ? T : never;
};
