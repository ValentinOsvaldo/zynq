import { describe, it, expect } from 'vitest';
import { s } from './builder';

describe('schema builder (s)', () => {
  describe('s.string', () => {
    it('creates StringCodec with default empty string', () => {
      const codec = s.string();
      expect(codec.decode(null)).toBe('');
      expect(codec.encode('hi')).toBe('hi');
    });

    it('accepts custom default', () => {
      const codec = s.string('default');
      expect(codec.decode(undefined)).toBe('default');
    });
  });

  describe('s.number', () => {
    it('creates NumberCodec with default 0', () => {
      const codec = s.number();
      expect(codec.decode(null)).toBe(0);
      expect(codec.encode(10)).toBe('10');
    });

    it('accepts custom default for invalid input', () => {
      const codec = s.number(100);
      expect(codec.decode('x')).toBe(100);
      expect(codec.decode(undefined)).toBe(100);
    });
  });

  describe('s.boolean', () => {
    it('creates BooleanCodec with default false', () => {
      const codec = s.boolean();
      expect(codec.decode(null)).toBe(false);
      expect(codec.encode(true)).toBe('true');
    });

    it('accepts custom default (used when decode gets null/undefined; BooleanCodec returns false for those)', () => {
      const codec = s.boolean(true);
      expect(codec.defaultValue).toBe(true);
    });
  });

  describe('s.date', () => {
    it('creates DateCodec', () => {
      const def = new Date('2024-01-01T00:00:00.000Z');
      const codec = s.date(def);
      expect(codec.decode(null)).toEqual(def);
      expect(codec.encode(new Date('2024-06-01T00:00:00.000Z'))).toBe(
        '2024-06-01T00:00:00.000Z',
      );
    });
  });

  describe('s.array', () => {
    it('creates ArrayCodec with inner codec', () => {
      const codec = s.array(s.number(), []);
      expect(codec.decode('1,2,3')).toEqual([1, 2, 3]);
      expect(codec.encode([1, 2])).toBe('1,2');
    });

    it('uses default array when value empty', () => {
      const codec = s.array(s.string(), ['a']);
      expect(codec.decode('')).toEqual(['a']);
    });
  });

  describe('s.object', () => {
    it('creates ObjectCodec with shape and default from inner codecs', () => {
      const codec = s.object({ name: s.string(''), count: s.number(0) });
      expect(codec.decode(null)).toEqual({ name: '', count: 0 });
      expect(codec.defaultValue).toEqual({ name: '', count: 0 });
    });

    it('encodes and decodes object as JSON', () => {
      const codec = s.object({ name: s.string(), count: s.number(0) });
      const value = { name: 'foo', count: 42 };
      expect(codec.decode(codec.encode(value))).toEqual(value);
    });

    it('returns default when value is empty or invalid JSON', () => {
      const codec = s.object({ tag: s.string('x') });
      expect(codec.decode('')).toEqual({ tag: 'x' });
      expect(codec.decode('not json')).toEqual({ tag: 'x' });
    });
  });
});
