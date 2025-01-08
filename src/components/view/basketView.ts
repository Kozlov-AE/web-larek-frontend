import { IBasket, OrderingViewEvents } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class BasketView extends Component<IBasket> {
  private readonly _totalCost: HTMLElement;
  private _toOrderButton: HTMLButtonElement;
  private _basket: HTMLUListElement
  private _events: IEvents;

  constructor (container: HTMLElement, events: IEvents) {
    super(container);
    this._events = events;

    this._totalCost = this.container.querySelector('.basket__price');
    this._toOrderButton = this.container.querySelector('.basket__button');
    this._basket = this.container.querySelector('.basket__list');

    this._toOrderButton.addEventListener('click', () => {
      this._events.emit(OrderingViewEvents.BasketAccepted);
    });
  }

  set basket(items: HTMLElement[]) {
    this._basket.replaceChildren(...items);
    this._toOrderButton.disabled = items.length === 0;
  }

  set totalCost(cost: number) {
    this.setText(this._totalCost, cost);
  }

  render(data?: Partial<IBasket>): HTMLElement {
    return super.render(data);
  }
}