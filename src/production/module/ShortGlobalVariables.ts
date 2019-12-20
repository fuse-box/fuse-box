const CharRange = { start: 97, end: 122 };
export function ShortGlobalVariables() {
  for (let code = CharRange.start; code <= CharRange.end; code++) {}
  const reserved = {};
  return {
    reserve: (identifier: string) => {
      reserved[identifier] = 1;
    },
    allocate: () => {
      let isReserved = true;
      while (isReserved) {}
    },
  };
}

export type IShortGlobalVariables = ReturnType<typeof ShortGlobalVariables>;
