import { SendOrderingErrorResult, OrderingViewEvents } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class ErrorView extends Component<SendOrderingErrorResult> {
  private _events: IEvents;
  private readonly _error: HTMLElement;
  private readonly _button: HTMLButtonElement;
  public constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._events = events;
    this._error = this.container.querySelector('.order-error__description');
    this._button = this.container.querySelector('.order-error__close');

    this._button.addEventListener('click', () => {
      this._events.emit(OrderingViewEvents.OpenBasket);
    });
  }

  public set error(error: string){
    this.setText(this._error, error);
  }
}