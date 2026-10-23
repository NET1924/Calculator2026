// Complex number utilities
// A complex number is represented as { re: number, im: number }

export interface Complex {
  re: number;
  im: number;
}

export const complex = (re: number, im: number = 0): Complex => ({ re, im });

export const complexFromPolar = (r: number, theta: number): Complex => ({
  re: r * Math.cos(theta),
  im: r * Math.sin(theta),
});

export const complexAdd = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
});

export const complexSub = (a: Complex, b: Complex): Complex => ({
  re: a.re - b.re,
  im: a.im - b.im,
});

export const complexMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export const complexDiv = (a: Complex, b: Complex): Complex => {
  const denom = b.re * b.re + b.im * b.im;
  if (denom === 0) return { re: NaN, im: NaN };
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  };
};

export const complexAbs = (z: Complex): number =>
  Math.sqrt(z.re * z.re + z.im * z.im);

export const complexArg = (z: Complex): number => Math.atan2(z.im, z.re);

export const complexConjugate = (z: Complex): Complex => ({
  re: z.re,
  im: -z.im,
});

export const complexNeg = (z: Complex): Complex => ({
  re: -z.re,
  im: -z.im,
});

export const complexPow = (z: Complex, n: number): Complex => {
  const r = complexAbs(z);
  const theta = complexArg(z);
  return complexFromPolar(Math.pow(r, n), theta * n);
};

export const complexSqrt = (z: Complex): Complex => {
  const r = complexAbs(z);
  const theta = complexArg(z);
  return complexFromPolar(Math.sqrt(r), theta / 2);
};

export const complexExp = (z: Complex): Complex => {
  const er = Math.exp(z.re);
  return {
    re: er * Math.cos(z.im),
    im: er * Math.sin(z.im),
  };
};

export const complexLn = (z: Complex): Complex => ({
  re: Math.log(complexAbs(z)),
  im: complexArg(z),
});

export const complexSin = (z: Complex): Complex => ({
  re: Math.sin(z.re) * Math.cosh(z.im),
  im: Math.cos(z.re) * Math.sinh(z.im),
});

export const complexCos = (z: Complex): Complex => ({
  re: Math.cos(z.re) * Math.cosh(z.im),
  im: -Math.sin(z.re) * Math.sinh(z.im),
});

export const complexTan = (z: Complex): Complex => {
  const num = complexSin(z);
  const den = complexCos(z);
  return complexDiv(num, den);
};

export const complexToString = (z: Complex, precision: number = 4): string => {
  const re = parseFloat(z.re.toFixed(precision));
  const im = parseFloat(z.im.toFixed(precision));
  if (im === 0) return `${re}`;
  if (re === 0) {
    if (im === 1) return 'i';
    if (im === -1) return '-i';
    return `${im}i`;
  }
  const imStr = im === 1 ? '' : im === -1 ? '-' : `${im}`;
  const sign = im > 0 ? '+' : '−';
  const absIm = Math.abs(im);
  const imPart = absIm === 1 ? 'i' : `${absIm}i`;
  return `${re} ${sign} ${imPart}`;
};

export const parseComplex = (input: string): Complex | null => {
  const s = input.trim().replace(/\s+/g, '').replace(/−/g, '-');
  
  // Pure imaginary: bi or i or -i
  const pureImag = s.match(/^([+-]?\d*\.?\d*)?i$/);
  if (pureImag) {
    const coeff = pureImag[1];
    if (!coeff || coeff === '+' || coeff === '') return { re: 0, im: 1 };
    if (coeff === '-') return { re: 0, im: -1 };
    return { re: 0, im: parseFloat(coeff) };
  }
  
  // Pure real
  if (/^[+-]?\d*\.?\d+(e[+-]?\d+)?$/i.test(s)) {
    return { re: parseFloat(s), im: 0 };
  }
  
  // a + bi or a - bi
  const match = s.match(/^([+-]?\d*\.?\d+)([+-])(\d*\.?\d*)i$/);
  if (match) {
    const re = parseFloat(match[1]);
    const sign = match[2] === '+' ? 1 : -1;
    const imStr = match[3];
    const im = imStr === '' ? sign : sign * parseFloat(imStr);
    return { re, im };
  }
  
  return null;
};

// Evaluate a complex function f(z) given as string
export const evalComplexFunction = (
  expr: string,
  z: Complex
): Complex | null => {
  try {
    // Replace z with the actual complex number operations
    // We'll use a simple approach: substitute z and evaluate
    let processed = expr
      .replace(/\s+/g, '')
      .replace(/−/g, '-')
      .replace(/\^/g, '**');
    
    // Simple approach: evaluate real and imaginary parts numerically
    // using complex arithmetic
    return evaluateComplexExpr(processed, z);
  } catch {
    return null;
  }
};

// Recursive descent parser for complex expressions
type Token =
  | { type: 'number'; value: number }
  | { type: 'var' }
  | { type: 'imag' }
  | { type: 'op'; value: string }
  | { type: 'func'; value: string }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'comma' };

const tokenize = (expr: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  const s = expr.replace(/\s+/g, '');
  
  while (i < s.length) {
    const ch = s[i];
    
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < s.length && /[0-9.eE+-]/.test(s[i])) {
        // Handle scientific notation carefully
        if ((s[i] === '+' || s[i] === '-') && num.length > 0 && !/[eE]/.test(num[num.length - 1])) {
          break;
        }
        num += s[i];
        i++;
      }
      tokens.push({ type: 'number', value: parseFloat(num) });
      continue;
    }
    
    if (ch === 'z' || ch === 'Z') {
      tokens.push({ type: 'var' });
      i++;
      continue;
    }
    
    if (ch === 'i' || ch === 'I') {
      tokens.push({ type: 'imag' });
      i++;
      continue;
    }
    
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    
    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }
    
    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }
    
    if (ch === ',') {
      tokens.push({ type: 'comma' });
      i++;
      continue;
    }
    
    // Function name
    if (/[a-zA-Z]/.test(ch)) {
      let name = '';
      while (i < s.length && /[a-zA-Z]/.test(s[i])) {
        name += s[i];
        i++;
      }
      if (name === 'z' || name === 'Z') {
        tokens.push({ type: 'var' });
      } else if (name === 'i' || name === 'I') {
        tokens.push({ type: 'imag' });
      } else if (name === 'e' && (i >= s.length || s[i] !== 'x')) {
        tokens.push({ type: 'number', value: Math.E });
      } else if (name === 'pi') {
        tokens.push({ type: 'number', value: Math.PI });
      } else {
        tokens.push({ type: 'func', value: name.toLowerCase() });
      }
      continue;
    }
    
    i++;
  }
  
  return tokens;
};

class Parser {
  private tokens: Token[];
  private pos: number;
  private z: Complex;
  
  constructor(tokens: Token[], z: Complex) {
    this.tokens = tokens;
    this.pos = 0;
    this.z = z;
  }
  
  private peek(): Token | null {
    return this.pos < this.tokens.length ? this.tokens[this.pos] : null;
  }
  
  private consume(): Token {
    return this.tokens[this.pos++];
  }
  
  private isOp(tok: Token | null): tok is { type: 'op'; value: string } {
    return tok?.type === 'op';
  }
  
  private getOpValue(tok: Token | null): string | null {
    if (tok && tok.type === 'op') return (tok as { type: 'op'; value: string }).value;
    return null;
  }
  
  // expr = term (('+' | '-') term)*
  parseExpr(): Complex {
    let result = this.parseTerm();
    const opVal = this.getOpValue(this.peek());
    while (opVal === '+' || opVal === '-') {
      this.consume();
      const right = this.parseTerm();
      result = opVal === '+' ? complexAdd(result, right) : complexSub(result, right);
    }
    return result;
  }
  
  // term = factor (('*' | '/') factor)*
  parseTerm(): Complex {
    let result = this.parsePower();
    const opVal = this.getOpValue(this.peek());
    while (opVal === '*' || opVal === '/') {
      this.consume();
      const right = this.parsePower();
      result = opVal === '*' ? complexMul(result, right) : complexDiv(result, right);
    }
    return result;
  }
  
  // power = unary ('^' unary)*
  parsePower(): Complex {
    let base = this.parseUnary();
    while (this.getOpValue(this.peek()) === '^') {
      this.consume();
      const exp = this.parseUnary();
      // z^w = exp(w * ln(z))
      if (exp.im === 0) {
        base = complexPow(base, exp.re);
      } else {
        const lnBase = complexLn(base);
        const product = complexMul(exp, lnBase);
        base = complexExp(product);
      }
    }
    return base;
  }
  
  // unary = ('+' | '-')? primary
  parseUnary(): Complex {
    const opVal = this.getOpValue(this.peek());
    if (opVal === '+' || opVal === '-') {
      this.consume();
      const val = this.parsePrimary();
      return opVal === '-' ? complexNeg(val) : val;
    }
    return this.parsePrimary();
  }
  
  // primary = number | 'z' | 'i' | func '(' expr (',' expr)? ')' | '(' expr ')'
  parsePrimary(): Complex {
    const tok = this.peek();
    if (!tok) return { re: NaN, im: NaN };
    
    if (tok.type === 'number') {
      this.consume();
      return { re: (tok as { type: 'number'; value: number }).value, im: 0 };
    }
    
    if (tok.type === 'var') {
      this.consume();
      return this.z;
    }
    
    if (tok.type === 'imag') {
      this.consume();
      return { re: 0, im: 1 };
    }
    
    if (tok.type === 'func') {
      const fname = (tok as { type: 'func'; value: string }).value;
      this.consume();
      if (this.peek()?.type !== 'lparen') {
        return { re: NaN, im: NaN };
      }
      this.consume(); // (
      const arg = this.parseExpr();
      
      // Handle two-arg functions like pow
      let arg2: Complex | null = null;
      if (this.peek()?.type === 'comma') {
        this.consume();
        arg2 = this.parseExpr();
      }
      
      if (this.peek()?.type === 'rparen') {
        this.consume();
      }
      
      return this.applyFunc(fname, arg, arg2);
    }
    
    if (tok.type === 'lparen') {
      this.consume();
      const result = this.parseExpr();
      if (this.peek()?.type === 'rparen') {
        this.consume();
      }
      return result;
    }
    
    return { re: NaN, im: NaN };
  }
  
  private applyFunc(name: string, arg: Complex, arg2: Complex | null): Complex {
    switch (name) {
      case 'sin': return complexSin(arg);
      case 'cos': return complexCos(arg);
      case 'tan': return complexTan(arg);
      case 'exp': return complexExp(arg);
      case 'ln':
      case 'log': return complexLn(arg);
      case 'sqrt': return complexSqrt(arg);
      case 'abs':
      case 'mod': return { re: complexAbs(arg), im: 0 };
      case 'arg':
      case 'angle': return { re: complexArg(arg), im: 0 };
      case 'conj':
      case 'conjugate': return complexConjugate(arg);
      case 're':
      case 'real': return { re: arg.re, im: 0 };
      case 'im':
      case 'imag': return { re: arg.im, im: 0 };
      case 'pow':
        if (arg2) {
          if (arg2.im === 0) return complexPow(arg, arg2.re);
          const lnA = complexLn(arg);
          return complexExp(complexMul(arg2, lnA));
        }
        return { re: NaN, im: NaN };
      default:
        return { re: NaN, im: NaN };
    }
  }
}

export const evaluateComplexExpr = (expr: string, z: Complex): Complex => {
  const tokens = tokenize(expr);
  const parser = new Parser(tokens, z);
  return parser.parseExpr();
};
