import { ProductItemEvents } from "../../types";
import { IEvents } from "../base/events";
import { ProductView } from "./productView";

export class ProductPreviewView extends ProductView {
  constructor(container: HTMLElement, events: IEvents, isInTheBasket: boolean) {
    super(container, events);

    if (isInTheBasket) {
      this.setText(this._button, 'Отменить');
      this._button.addEventListener('click', event => {
        event.stopPropagation();
        this._events.emit(ProductItemEvents.RemoveProduct, this);
      });
    } else {
      this.setText(this._button, 'В корзину');
      this._button.addEventListener('click', event => {
        event.stopPropagation();
        this._events.emit(ProductItemEvents.BuyProduct, this);
      });
    }
  }
}