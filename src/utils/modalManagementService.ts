import { IEvents } from '../components/base/events';
import { CatalogPresenter } from '../components/presenter/catalogPresenter';
import { OrderingPresenter } from '../components/presenter/orderingPresenter';
import { IProductsData, ProductsDataEvents } from '../types';

export class ModalManagementService {
	private _events: IEvents;
	private _body: HTMLBodyElement
	private _modalContainer: HTMLElement;
	private _products: IProductsData;
	private _openedModal: HTMLElement = null;

	private _openedPopup: HTMLElement | null = null;

	constructor(events: IEvents,
							body: HTMLBodyElement,
							products: IProductsData) {
		this._events = events;
		this._body = body;
		this._products = products;
	}

	public showModal(content: HTMLElement){
		this._modalContainer.textContent. = HTMLElement;
		if (!this._openedModal){

		}
	}
}