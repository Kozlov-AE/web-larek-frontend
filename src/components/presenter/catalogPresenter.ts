import { ICatalog, ProductsDataEvents } from '../../types';
import { IEvents } from '../base/events';
import { cloneTemplate } from '../../utils/utils';
import { ProductCatalogView } from '../view/productCatalogView';

export class CatalogPresenter {
	private _events: IEvents;
	private _catalogView: ICatalog;
	private _catalogItemTemplate: HTMLTemplateElement;


	constructor(events: IEvents,
							catalog: ICatalog,
							productTemplate: HTMLTemplateElement) {
		this._events = events;
		this._catalogView = catalog;
		this._catalogItemTemplate = productTemplate;

		this.subscribeToDataEvents();
	}

	private subscribeToDataEvents(): void {
		this._events.on(ProductsDataEvents.CatalogChanged, products => {
			let renderedProducts: HTMLElement[];
			if (Array.isArray(products)) {
				renderedProducts = products.map(p => {
					return new ProductCatalogView(cloneTemplate(this._catalogItemTemplate), this._events).render(p);
				});
			}
			this._catalogView.render( { catalog:renderedProducts } );
		})
	}
}