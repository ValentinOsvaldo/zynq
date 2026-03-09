import { describe, it, expect } from 'vitest';
import {
  StringCodec,
  NumberCodec,
  BooleanCodec,
  DateCodec,
  ArrayCodec,
} from './codec';

describe('StringCodec', () => {
  it('decodes string value', () => {
    const codec = new StringCodec('default');
    expect(codec.decode('hello')).toBe('hello');
  });

  it('returns defaultValue for null/undefined', () => {
    const codec = new StringCodec('default');
    expect(codec.decode(null)).toBe('default');
    expect(codec.decode(undefined)).toBe('default');
  });

  it('encodes value as-is', () => {
    const codec = new StringCodec('');
    expect(codec.encode('foo')).toBe('foo');
  });
});

describe('NumberCodec', () => {
  it('decodes numeric string', () => {
    const codec = new NumberCodec(0);
    expect(codec.decode('42')).toBe(42);
    expect(codec.decode('-3.14')).toBe(-3.14);
  });

  it('returns defaultValue for invalid string', () => {
    const codec = new NumberCodec(99);
    expect(codec.decode('abc')).toBe(99);
  });

  it('decodes empty string as 0 (Number("") is 0)', () => {
    const codec = new NumberCodec(99);
    expect(codec.decode('')).toBe(0);
  });

  it('decodes null as 0, undefined as defaultValue (Number coercion)', () => {
    const codec = new NumberCodec(99);
    expect(codec.decode(null)).toBe(0);
    expect(codec.decode(undefined)).toBe(99);
  });

  it('encodes number to string', () => {
    const codec = new NumberCodec(0);
    expect(codec.encode(42)).toBe('42');
    expect(codec.encode(-3.14)).toBe('-3.14');
  });
});

describe('BooleanCodec', () => {
  it('decodes truthy string as true', () => {
    const codec = new BooleanCodec(false);
    expect(codec.decode('true')).toBe(true);
    expect(codec.decode('1')).toBe(true);
    expect(codec.decode('yes')).toBe(true);
  });

  it('decodes empty string and null/undefined as false', () => {
    const codec = new BooleanCodec(false);
    expect(codec.decode('')).toBe(false);
    expect(codec.decode(null)).toBe(false);
    expect(codec.decode(undefined)).toBe(false);
  });

  it('decodes any non-empty string as true (e.g. "false" is truthy)', () => {
    const codec = new BooleanCodec(false);
    expect(codec.decode('false')).toBe(true);
    expect(codec.decode('0')).toBe(true);
  });

  it('decodes null/undefined as false (BooleanCodec does not use default for null/undefined)', () => {
    const codec = new BooleanCodec(true);
    expect(codec.decode(null)).toBe(false);
    expect(codec.decode(undefined)).toBe(false);
  });

  it('encodes boolean to string', () => {
    const codec = new BooleanCodec(false);
    expect(codec.encode(true)).toBe('true');
    expect(codec.encode(false)).toBe('false');
  });
});

describe('DateCodec', () => {
  it('decodes ISO string to Date', () => {
    const codec = new DateCodec(new Date(0));
    const date = codec.decode('2024-01-15T12:00:00.000Z');
    expect(date).toBeInstanceOf(Date);
    expect(date.toISOString()).toBe('2024-01-15T12:00:00.000Z');
  });

  it('returns defaultValue for null/undefined', () => {
    const def = new Date(2024, 0, 1);
    const codec = new DateCodec(def);
    expect(codec.decode(null)).toEqual(def);
    expect(codec.decode(undefined)).toEqual(def);
  });

  it('encodes Date to ISO string', () => {
    const codec = new DateCodec(new Date(0));
    const d = new Date('2024-06-01T00:00:00.000Z');
    expect(codec.encode(d)).toBe('2024-06-01T00:00:00.000Z');
  });
});

describe('ArrayCodec', () => {
  it('decodes comma-separated string with inner codec', () => {
    const codec = new ArrayCodec(new NumberCodec(0), []);
    expect(codec.decode('1,2,3')).toEqual([1, 2, 3]);
  });

  it('returns defaultValue for null/undefined/empty', () => {
    const codec = new ArrayCodec(new StringCodec(''), ['a', 'b']);
    expect(codec.decode(null)).toEqual(['a', 'b']);
    expect(codec.decode(undefined)).toEqual(['a', 'b']);
    expect(codec.decode('')).toEqual(['a', 'b']);
  });

  it('encodes array to comma-separated string', () => {
    const codec = new ArrayCodec(new NumberCodec(0), []);
    expect(codec.encode([1, 2, 3])).toBe('1,2,3');
  });

  it('works with StringCodec inner', () => {
    const codec = new ArrayCodec(new StringCodec(''), []);
    expect(codec.decode('a,b,c')).toEqual(['a', 'b', 'c']);
    expect(codec.encode(['x', 'y'])).toBe('x,y');
  });
});
