import { ProductItemEvents } from "../../types";
import { IEvents } from "../base/events";
import { ProductView } from "./productView";

export class ProductCatalogView extends ProductView {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
      this.container.addEventListener('click', () => {
        console.log('Кликнул по кнопке продукта');
        this._events.emit(ProductItemEvents.ProductSelected, this);
      });
    }
}