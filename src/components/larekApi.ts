import { IProduct } from "../types";
import { Api } from "./base/api";

export class LarekApi extends Api {
  constructor(baseUrl: string) {
    super(baseUrl);

  }

  async getProductList(): Promise<IProduct[]>{
    const response = await super.get('/product/');
    return response as IProduct[];
  }


}