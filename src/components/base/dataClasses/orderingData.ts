import { IProduct, TClientDetails, TOrderDetails } from "../../../types";
import { IEvents } from "../events";

export class OrderingData {
  readonly #events: IEvents;
  #basket: IProduct[];
  #orderingDetails: TOrderDetails;
  #clientDetails: TClientDetails;

  constructor(events: IEvents) {
    this.#events = events;
  }

  addProduct(product: IProduct): void {
    this.#basket.push(product);
  }

}
