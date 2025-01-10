import { ModalEvents, TModal } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class ModalView extends Component<TModal> {
  private readonly activeClass = 'modal_active';
  private _content: HTMLElement;

  private _isOpened = false;

  private _closeButton: HTMLButtonElement;

  private readonly _events: IEvents;

  constructor (modalContainer: HTMLElement, events: IEvents){
    super(modalContainer);
    this._events = events;
    this._content = modalContainer.querySelector('.modal__content')

    this._closeButton = modalContainer.querySelector('.modal__close')

    this._closeButton.addEventListener('click', () => {
      this.hide();
    });

    this.container.addEventListener('click', event => {
      if (event.target === this.container){
        this.hide();
      }
    });
  }

  public show(){
    if (!this._isOpened){
      this.toggleClass(this.container, this.activeClass);
      this._isOpened = true;
    }
  }

  public hide(){
    if (this._isOpened){
      this.toggleClass(this.container, this.activeClass);
      this._content.innerHTML = '';
      this._events.emit(ModalEvents.Closed);
      this._isOpened = false;
    }
  }

  public setContent(content: HTMLElement){
    this._content.innerHTML = '';
    this._content.appendChild(content);
  }

  get isOpened(){
    return this._isOpened;
  }
}