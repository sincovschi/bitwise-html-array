const isPowerOfTwo = (x: number): boolean => {
  return x != 0 && (x & (x - 1)) == 0;
};

export function getEnumFlags<
  O extends object,
  K extends O[keyof O] = O[keyof O]
>(obj: O): K[] {
  const isFlag = (arg: string | number | K): arg is K => {
    const nArg = Number(arg);
    const isNumber = !Number.isNaN(nArg);
    return isNumber && isPowerOfTwo(nArg);
  };

  const enumFlags: K[] = [];

  Object.keys(obj).forEach(key => {
    const nKey = Number(key);
    if (isFlag(nKey)) {
      enumFlags.push(nKey);
    }
  });

  return enumFlags;
}

export function getEnumValues<
  O extends object,
  K extends O[keyof O] = O[keyof O]
>(obj: O): K[] {
  const isFlag = (arg: string | number | K): arg is K => {
    const nArg = Number(arg);
    return !Number.isNaN(nArg);
  };

  const enumFlags: K[] = [];

  Object.keys(obj).forEach(key => {
    const nKey = Number(key);
    if (isFlag(nKey)) {
      enumFlags.push(nKey);
    }
  });

  return enumFlags;
}
