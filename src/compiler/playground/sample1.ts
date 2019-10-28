/**
 * Annotation '@exception' to give the exception a name and a key
 */
export const exception = <Ex extends new (...args: any[]) => any>(constructor: Ex) => {
  return class extends constructor {
    public name = constructor.name;
  };
};
