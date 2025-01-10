import { IProduct, TProductCategory } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { CDN_URL } from '../../utils/constants';

export abstract class ProductView extends Component<IProduct> {
	protected _events: IEvents;
	protected _isInTheBasket: boolean;

	protected _id: string;
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _button: HTMLButtonElement;

	protected _hasPrice = true;

	protected constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;

		this._title = this.container.querySelector('.card__title');
		this._description = this.container.querySelector('.card__text');
		this._price = this.container.querySelector('.card__price');
		this._image = this.container.querySelector('.card__image');
		this._category = this.container.querySelector('.card__category');
		this._button = this.container.querySelector('.card__button');
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

	set price(price: string | null) {
		const text = price === null ? 'Бесценно' : price + ' синапсов';
		super.setText(this._price, text);
	}

	set image(image: string) {
		super.setImage(this._image, CDN_URL + image);
	}

	delete() {
		this.container.remove();
		this.container = null;
	}

	StopBuy() {
		this.setDisabled(this._button, true);
	}
}
