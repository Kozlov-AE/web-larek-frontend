import { it } from "node:test";
import { IBasket, IOrdering, IProduct, OrderingDataEvents, OrderingViewEvents, ProductItemEvents } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ProductView, ProductViewType } from "./productView";
import { object } from "yup";



export class BasketView extends Component<IBasket> {
  private _totalCost: HTMLElement;
  private _toOrderButton: HTMLButtonElement;
  private _basket: HTMLUListElement
  private _events: IEvents;

  constructor (container: HTMLElement, events: IEvents) {
    super(container);
    this._events = events;

    this._totalCost = this.container.querySelector('.basket__price');
    this._toOrderButton = this.container.querySelector('.basket__button');
    this._basket = this.container.querySelector('.basket__list');

    this._toOrderButton.addEventListener('click', event => {
      this._events.emit(OrderingViewEvents.BasketAccepted);
    });
  }

  set basket(items: HTMLElement[]) {
    this._basket.replaceChildren(...items);
  }

  set totalCost(cost: number) {
    this.setText(this._totalCost, cost);
  }

  render(data?: Partial<IBasket>): HTMLElement {
    return super.render(data);
  }
}