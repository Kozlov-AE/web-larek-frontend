import { IProductsData, ICatalog, ProductsDataEvents } from '../../types';
import { IEvents } from '../base/events';
import * as events from 'node:events';
import { ProductView } from '../view/productView';
import { cloneTemplate } from '../../utils/utils';
import { CatalogView } from '../view/catalogView';

export class CatalogPresenter {
	private _events: IEvents;
	private _productsData: IProductsData;
	private _catalogView: ICatalog;
	private _template: HTMLTemplateElement;
	private _catalogContainer: HTMLElement;

	constructor(events: IEvents, catalog: ICatalog, productsData: IProductsData, productTemplate: HTMLTemplateElement) {
		this._events = events;
		this._productsData = productsData;
		this._catalogView = catalog;
		this._template = productTemplate;

		this.subscribeToDataEvents();
		this.subscribeToViewEvents();
	}

	private subscribeToDataEvents(): void {
		this._events.on(ProductsDataEvents.CatalogChanged, products => {
			let renderedProducts: HTMLElement[];
			if (Array.isArray(products)) {
				renderedProducts = products.map(p => {
					return new ProductView(cloneTemplate(this._template), this._events).render(p);
				});
			}
			this._catalogView.render( { catalog:renderedProducts } );
		})
	}

	private subscribeToViewEvents(): void {
		return;
	}
}