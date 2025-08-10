import { IAuthenticatedClient, IClientCredentials } from "@/interfaces/Client";
import { createRestClient } from "@ln-markets/api";

export abstract class ClientService {

  static async clientAuthentic(credentials: IClientCredentials): Promise<IAuthenticatedClient> {
    try {
      const client = await createRestClient(credentials);

      return client;
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }
  static async clientDraw(client:any){
    try {
      const userDraw = await client.userWithdraw();
  
      return userDraw
      
    } catch (error) {
      console.log(error);
    }
  }
   static getCredentialsClient() {
    return {
      key: "ESug78njAyd69Wy2fLtZAg9TqcECAvgCpbIA7Avvots=",
      secret: "umyFMPXQ3b2vgcEX8OauFLzp2FGeSs4liJhJmpovjX+4s/52OXvoRbJTHFayZf3876DY1sW/hj8cTT+J5A2+3w==",
      passphrase:"1b3a27370ibh7",
    };
  }
  static getRiskThreshold(userId: string): number{
    return 30
  }
  static getAmountForSetMargin(userId: string): number{
    return 50
  }
}
