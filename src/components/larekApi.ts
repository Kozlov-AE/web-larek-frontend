import {
  checkIProduct,
  IOrdering,
  IProduct,
} from '../types';
import { Api } from "./base/api";

export class LarekApi extends Api {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getProductList(): Promise<IProduct[]>{
    const response = await super.get('/product/');
    if ('items' in response && Array.isArray(response.items) && response.items.every(checkIProduct)) {
			return response.items;
		}
    console.error("getProductList error: there is something wrong, returning empty list")
		return [];
  }

  async postOrder(ordering: IOrdering): Promise<object> {
    let result;
    await super.post('/order', ordering)
    .then(response => {
      result = response;
    })
    .catch(error => {
      console.error('Send ordering error: ' + error);
      result = {error: error}}
    );
    return result;
  }
}