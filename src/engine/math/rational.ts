/**
 * Exact Rational Arithmetic Engine
 * Handles exact integer and fraction math with zero floating-point loss.
 */

export class Rational {
  public readonly num: bigint;
  public readonly den: bigint;

  constructor(numerator: bigint | number | string, denominator: bigint | number | string = 1n) {
    let n = typeof numerator === 'bigint' ? numerator : BigInt(Math.trunc(Number(numerator)));
    let d = typeof denominator === 'bigint' ? denominator : BigInt(Math.trunc(Number(denominator)));

    if (d === 0n) {
      throw new Error('Division by zero in Rational construction');
    }

    if (d < 0n) {
      n = -n;
      d = -d;
    }

    const g = Rational.gcd(n < 0n ? -n : n, d);
    this.num = n / g;
    this.den = d / g;
  }

  public static fromNumber(val: number): Rational {
    if (!Number.isFinite(val)) {
      throw new Error(`Cannot convert non-finite number ${val} to Rational`);
    }
    if (Number.isInteger(val)) {
      return new Rational(BigInt(val), 1n);
    }
    // Convert decimal to exact fraction
    const str = val.toString();
    if (str.includes('e') || str.includes('E')) {
      // Fallback for scientific notation
      const [coeff, expStr] = str.toLowerCase().split('e');
      const exp = parseInt(expStr, 10);
      const base = Rational.fromNumber(parseFloat(coeff));
      if (exp >= 0) {
        return base.mul(new Rational(10n ** BigInt(exp), 1n));
      } else {
        return base.div(new Rational(10n ** BigInt(-exp), 1n));
      }
    }
    const parts = str.split('.');
    const decimalPlaces = parts[1] ? parts[1].length : 0;
    const factor = 10n ** BigInt(decimalPlaces);
    const num = BigInt(parts[0]) * factor + (parts[1] ? BigInt(parts[1]) * (val < 0 ? -1n : 1n) : 0n);
    return new Rational(num, factor);
  }

  public static from(val: Rational | number | bigint | string): Rational {
    if (val instanceof Rational) return val;
    if (typeof val === 'number') return Rational.fromNumber(val);
    if (typeof val === 'bigint') return new Rational(val, 1n);
    if (typeof val === 'string') {
      if (val.includes('/')) {
        const [n, d] = val.split('/');
        return new Rational(n.trim(), d.trim());
      }
      return Rational.fromNumber(parseFloat(val));
    }
    throw new Error(`Invalid value for Rational: ${val}`);
  }

  private static gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a === 0n ? 1n : a;
  }

  public add(other: Rational | number | bigint): Rational {
    const o = Rational.from(other);
    const n = this.num * o.den + o.num * this.den;
    const d = this.den * o.den;
    return new Rational(n, d);
  }

  public sub(other: Rational | number | bigint): Rational {
    const o = Rational.from(other);
    const n = this.num * o.den - o.num * this.den;
    const d = this.den * o.den;
    return new Rational(n, d);
  }

  public mul(other: Rational | number | bigint): Rational {
    const o = Rational.from(other);
    return new Rational(this.num * o.num, this.den * o.den);
  }

  public div(other: Rational | number | bigint): Rational {
    const o = Rational.from(other);
    if (o.num === 0n) {
      throw new Error('Division by zero in Rational.div');
    }
    return new Rational(this.num * o.den, this.den * o.num);
  }

  public pow(exponent: number | bigint): Rational {
    const exp = typeof exponent === 'bigint' ? Number(exponent) : exponent;
    if (!Number.isInteger(exp)) {
      throw new Error('Rational.pow currently supports exact integer powers');
    }
    if (exp === 0) return new Rational(1n, 1n);
    if (exp > 0) {
      return new Rational(this.num ** BigInt(exp), this.den ** BigInt(exp));
    }
    return new Rational(this.den ** BigInt(-exp), this.num ** BigInt(-exp));
  }

  public neg(): Rational {
    return new Rational(-this.num, this.den);
  }

  public abs(): Rational {
    return new Rational(this.num < 0n ? -this.num : this.num, this.den);
  }

  public inv(): Rational {
    if (this.num === 0n) throw new Error('Cannot invert zero Rational');
    return new Rational(this.den, this.num);
  }

  public isZero(): boolean {
    return this.num === 0n;
  }

  public isOne(): boolean {
    return this.num === 1n && this.den === 1n;
  }

  public isNegative(): boolean {
    return this.num < 0n;
  }

  public isInteger(): boolean {
    return this.den === 1n;
  }

  public equals(other: Rational | number | bigint): boolean {
    const o = Rational.from(other);
    return this.num === o.num && this.den === o.den;
  }

  public lt(other: Rational | number | bigint): boolean {
    const o = Rational.from(other);
    return this.num * o.den < o.num * this.den;
  }

  public gt(other: Rational | number | bigint): boolean {
    const o = Rational.from(other);
    return this.num * o.den > o.num * this.den;
  }

  public lte(other: Rational | number | bigint): boolean {
    const o = Rational.from(other);
    return this.num * o.den <= o.num * this.den;
  }

  public gte(other: Rational | number | bigint): boolean {
    const o = Rational.from(other);
    return this.num * o.den >= o.num * this.den;
  }

  public toNumber(): number {
    return Number(this.num) / Number(this.den);
  }

  public toString(): string {
    if (this.den === 1n) {
      return this.num.toString();
    }
    return `${this.num}/${this.den}`;
  }

  public toLatex(): string {
    if (this.den === 1n) {
      return this.num.toString();
    }
    if (this.num < 0n) {
      return `-\\frac{${-this.num}}{${this.den}}`;
    }
    return `\\frac{${this.num}}{${this.den}}`;
  }
}

export const R0 = new Rational(0n, 1n);
export const R1 = new Rational(1n, 1n);
export const R_NEG1 = new Rational(-1n, 1n);
export const R2 = new Rational(2n, 1n);
