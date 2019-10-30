declare module 'file-type' {
  namespace fileType {
    const minimumBytes: number;
  }

  function fileType(input: Buffer | Uint8Array): { ext: string; mime: string } | null;

  export = fileType;
}
