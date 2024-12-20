import { IProduct, TProductCategory, ProductItemEvents } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { CDN_URL } from '../../utils/constants';

export class ProductView extends Component<IProduct> {
	private _events: IEvents;
	private _isInTheBasket: boolean;

	protected _id: string;
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;

	private _button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;

		this._title = this.container.querySelector('.card__title');
		this._description = this.container.querySelector('.card__text');
		this._price = this.container.querySelector('.card__price');
		this._image = this.container.querySelector('.card__image');
		this._category = this.container.querySelector('.card__category');
		this._button = this.container.querySelector('.card__button');

		if (this._image) {
			this._image.addEventListener('click', () => {
				this._events.emit(ProductItemEvents.ProductSelected, this);
			});
		}

		if (this._button) {
			this._button.addEventListener('click', () => {
				if (this._isInTheBasket) {
					this._events.emit(ProductItemEvents.RemoveProduct, this);
				} else {
					this._events.emit(ProductItemEvents.BuyProduct, this);
				}
			});
		}
	}

	get isInTheBasket() {
		return this._isInTheBasket;
	}

	set	isInTheBasket(value: boolean) {
		this._isInTheBasket = value;
	}

	set id(id: string) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	set category(category: TProductCategory) {
		super.setText(this._category, category);
	}

	set title(title: string) {
		super.setText(this._title, title);
	}

	set description(description: string) {
		super.setText(this._description, description);
	}

	set price(price: string) {
		super.setText(this._price, price);
	}

	set image(image: string) {
		super.setImage(this._image, CDN_URL + image);
	}

	delete() {
		this.container.remove();
		this.container = null;
	}
}
