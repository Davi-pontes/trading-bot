declare module '@ln-markets/api' {
  export function createRestClient(credentials: IClientCredentials): any;
  export function createWebsocketClient(): any;
}
