import { IProductsData, ICatalog, ProductsDataEvents, ProductItemEvents } from '../../types';
import { IEvents } from '../base/events';
import * as events from 'node:events';
import { ProductView } from '../view/productView';
import { cloneTemplate } from '../../utils/utils';
import { CatalogView } from '../view/catalogView';
import { ModalManagementService } from '../../utils/modalManagementService';

export class CatalogPresenter {
	private _events: IEvents;
	private _modalService: ModalManagementService;
	private _productsData: IProductsData;
	private _catalogView: ICatalog;
	private _template: HTMLTemplateElement;
	private _catalogContainer: HTMLElement;

	constructor(events: IEvents,
							modalService: ModalManagementService,
							catalog: ICatalog,
							productsData: IProductsData,
							productTemplate: HTMLTemplateElement) {
		this._events = events;
		this._modalService = modalService;
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
		this._events.on(ProductItemEvents.ProductSelected, pr => {
			if (typeof(pr) === typeof(ProductView)) {
				const product = pr as ProductView;
				product
			}
		})
		return;
	}
}