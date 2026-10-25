export interface Complex {
  re: number;
  im: number;
}

export const complex = (re: number, im: number = 0): Complex => ({ re, im });

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

export const complexPow = (z: Complex, n: number): Complex => {
  const r = complexAbs(z);
  const theta = complexArg(z);
  const newR = Math.pow(r, n);
  const newTheta = theta * n;
  return {
    re: newR * Math.cos(newTheta),
    im: newR * Math.sin(newTheta),
  };
};

export const complexSqrt = (z: Complex): Complex => {
  const r = complexAbs(z);
  const theta = complexArg(z);
  const sqrtR = Math.sqrt(r);
  return {
    re: sqrtR * Math.cos(theta / 2),
    im: sqrtR * Math.sin(theta / 2),
  };
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
  const sin = complexSin(z);
  const cos = complexCos(z);
  return complexDiv(sin, cos);
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
  const sign = im > 0 ? '+' : '-';
  const absIm = Math.abs(im);
  const imStr = absIm === 1 ? 'i' : `${absIm}i`;
  return `${re} ${sign} ${imStr}`;
};

export const parseComplex = (input: string): Complex | null => {
  const s = input.trim().replace(/\s+/g, '').replace(/−/g, '-');
  
  // Pure imaginary
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
