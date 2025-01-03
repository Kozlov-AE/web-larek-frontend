import { object } from "yup";
import { ProductItemEvents } from "../../types";
import { IEvents } from "../base/events";
import { ProductView } from "./productView";

export class ProductPreviewView extends ProductView {
  constructor(container: HTMLElement, events: IEvents, isInTheBasket: boolean) {
    super(container, events);

    if (isInTheBasket) {
      this._button.textContent = 'Отменить';
      this._button.addEventListener('click', event => {
        event.stopPropagation();
        this._events.emit(ProductItemEvents.RemoveProduct, this);
      });
    } else {
      this._button.textContent = 'В корзину';
      this._button.addEventListener('click', event => {
        event.stopPropagation();
        this._events.emit(ProductItemEvents.BuyProduct, this);
      });
    }
  }
}