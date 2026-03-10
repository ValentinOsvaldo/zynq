export abstract class Codec<T> {
  constructor(
    public readonly defaultValue: T,
    public readonly isRequired: boolean = false,
  ) {}

  abstract encode(value: T): string;
  abstract decode(value: string | null | undefined): T;
}

export class StringCodec extends Codec<string> {
  encode(value: string): string {
    return value;
  }

  decode(value: string | null | undefined): string {
    return value ?? this.defaultValue;
  }
}

export class NumberCodec extends Codec<number> {
  encode(value: number): string {
    return value.toString();
  }

  decode(value: string | null | undefined): number {
    const parsed = Number(value);
    return isNaN(parsed) ? this.defaultValue : parsed;
  }
}

export class BooleanCodec extends Codec<boolean> {
  encode(value: boolean): string {
    return value.toString();
  }

  decode(value: string | null | undefined): boolean {
    return Boolean(value);
  }
}

export class DateCodec extends Codec<Date> {
  encode(value: Date): string {
    return value.toISOString();
  }

  decode(value: string | null | undefined): Date {
    return new Date(value ?? this.defaultValue);
  }
}

export class ArrayCodec<T> extends Codec<T[]> {
  constructor(
    private readonly innerCodec: Codec<T>,
    defaultValue: T[] = [],
  ) {
    super(defaultValue);
  }

  encode(value: T[]): string {
    return value.map((v) => this.innerCodec.encode(v)).join(',');
  }

  decode(value: string | null | undefined): T[] {
    if (!value) return this.defaultValue;
    return value.split(',').map((item) => this.innerCodec.decode(item));
  }
}
