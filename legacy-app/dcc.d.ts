declare module '@pathcheck/dcc-sdk' {
  function unpackAndVerify(data: string, key?: string): Promise<unknown>;

  function unpack(uri: string): Promise<Uint8Array>;
  function parseCWT(cwt: unknown): Promise<unknown>;
}
