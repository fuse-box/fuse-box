const CharRange = { end: 122, start: 97 };

export function ShortGlobalVariables() {
  for (let code = CharRange.start; code <= CharRange.end; code++) {}
  const reserved = {};
  return {
    allocate: () => {
      let isReserved = true;
      while (isReserved) {}
    },
    reserve: (identifier: string) => {
      reserved[identifier] = 1;
    },
  };
}

export type IShortGlobalVariables = ReturnType<typeof ShortGlobalVariables>;
