import { ModalEvents } from "../../types";
import { IEvents } from "../base/events";

export class ModalView {
  private readonly activeClass = 'modal_active';
  private readonly _container: HTMLElement;
  private _content: HTMLElement;

  private _isOpened = false;

  private _closeButton: HTMLButtonElement;

  private readonly _events: IEvents;

  constructor (modalContainer: HTMLElement, events: IEvents){
    this._events = events;
    this._container = modalContainer;
    this._content = modalContainer.querySelector('.modal__content')

    this._closeButton = modalContainer.querySelector('.modal__close')

    this._closeButton.addEventListener('click', () => {
      this.hide();
    });

    this._container.addEventListener('click', event => {
      if (event.target === this._container){
        this.hide();
      }
    });
  }

  public show(){
    this._container.classList.add(this.activeClass);
    this._isOpened = true;
  }

  public hide(){
    this._container.classList.remove(this.activeClass);
    this._content.innerHTML = '';
    this._events.emit(ModalEvents.Closed);
    this._isOpened = false;
  }

  public toggle(){
    this._isOpened = !this._isOpened;
    this._container.classList.toggle(this.activeClass);
  }

  public setContent(content: HTMLElement){
    this._content.innerHTML = '';
    this._content.appendChild(content);
  }

  get isOpened(){
    return this._isOpened;
  }
}