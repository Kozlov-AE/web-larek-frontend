import {
  checkIProduct,
  IOrdering,
  IProduct,
  SendOrderingErrorResult,
  SendOrderingResult,
  SendOrderingSuccessResult,
} from '../types';
import { Api } from "./base/api";
import { boolean } from 'yup';

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

  async postOrder(ordering: IOrdering): Promise<SendOrderingResult>{
    let result: SendOrderingResult;
    super.post('/order', ordering)
      .then(response => {
        if ('error' in response) {
          result = response as SendOrderingResult;
        } else {
          result = response as SendOrderingSuccessResult;
        }
      })
      .catch(error => {
        console.error('Send ordering error: ' + error);
      })
    return result;
  }
}