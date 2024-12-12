import { IProduct, TProductCategory } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Product extends Component<IProduct> {
  protected events: IEvents;

  protected _id: string;
  protected _title: HTMLElement;
  protected _description: HTMLElement;
  protected _price: HTMLElement;
  protected _image: HTMLElement;
  protected _category: HTMLElement

  protected _buyButton: HTMLButtonElement;
  protected _deleteButton: HTMLButtonElement;


	constructor(container: HTMLElement, events: IEvents) {
		super(container);
    this.events = events;

    this._title = this.container.querySelector('.card__title');
    this._description = this.container.querySelector('.card__text');
    this._price = this.container.querySelector('.card__price');
    this._image = this.container.querySelector('.card__image');
    this._category = this.container.querySelector('.card__category');
    this._buyButton = this.container.querySelector('.card__button');

     this._image.addEventListener('click', () => {
      this.events.emit('product:image:click', this);
     })

	}

  isInTheBasket() {
    return false;
  }

}
