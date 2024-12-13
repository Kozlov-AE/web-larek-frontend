import { IProduct, TProductCategory, ProductItemEvents } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Product extends Component<IProduct> {
	private _events: IEvents;
	private _isInTheBasket: boolean;

	protected _id: string;
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLElement;
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

		this._image.addEventListener('click', () => {
			this._events.emit(ProductItemEvents.ProductSelected, this);
		});

		this._button.addEventListener('click', () => {
			if (this._isInTheBasket) {
				this._events.emit(ProductItemEvents.RemoveProduct, this);
			} else {
				this._events.emit(ProductItemEvents.BuyProduct, this);
			}
		});
	}

	render(productData?: Partial<IProduct> | undefined): HTMLElement {
		if (!productData) {
			return this.container;
		}
		const {...pd} = productData;
		super.render(pd)
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
		this._category.textContent = category;
	}

	set title(title: string) {
		this._title.textContent = title;
	}

	set description(description: string) {
		this._description.textContent = description;
	}

	set price(price: number) {
		this._price.textContent = price.toFixed(2);
	}

	set image(image: string) {
		this._image.src = image;
	}

	delete() {
		this.container.remove();
		this.container = null;
	}
}
