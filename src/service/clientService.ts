interface IClient {
  id: number;
  name: string;
  key: string;

  connectionLnMarkets(): void;
}

export class ClientService implements IClient {
  id: number;
  name: string;
  key: string;
  constructor(id: number, name: string, key: string) {
    this.id = id;
    this.name = name;
    this.key = key;
  }
  connectionLnMarkets(): void {
    throw new Error("Method not implemented.");
  }
}
