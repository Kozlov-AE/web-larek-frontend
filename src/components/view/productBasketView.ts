import { ProductItemEvents } from "../../types";
import { IEvents } from "../base/events";
import { ProductView } from "./productView";

export class ProductBasketView extends ProductView {
  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this._button.addEventListener('click', () => {
      this._events.emit(ProductItemEvents.RemoveProduct, this);
    });
  }
}