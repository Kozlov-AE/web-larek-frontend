import { ModalEvents, SendOrderingSuccessResult } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class SuccessView extends Component<SendOrderingSuccessResult> {
  private _events: IEvents;
  private _title: HTMLElement;
  private _description: HTMLElement;
  private _button: HTMLButtonElement;


  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this._events = events;

    this._title = this.container.querySelector('.order-success__title');
    this._description = this.container.querySelector('.order-success__description');
    this._button = this.container.querySelector('.order-success__close');

    this._button.addEventListener('click', () => {
      this._events.emit(ModalEvents.AskToClose);
    });
  }

  set total(value: number) {
    this.setText(this._description, 'Списано ' + value + ' синапсов');
  }
}