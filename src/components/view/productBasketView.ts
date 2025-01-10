import { ProductItemEvents } from "../../types";
import { IEvents } from "../base/events";
import { ProductView } from "./productView";

export class ProductBasketView extends ProductView {
  private _index: HTMLElement;
  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this._index = this.container.querySelector('.basket__item-index') as HTMLElement;

    this._button.addEventListener('click', () => {
      this._events.emit(ProductItemEvents.RemoveProduct, this);
    });
  }

  public set index(index: number) {
    this.setText(this._index, index.toString());
  }
}