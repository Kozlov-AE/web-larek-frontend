import { IProductsData, ICatalog, ProductsDataEvents, ProductItemEvents, IProduct, OrderingDataEvents } from '../../types';
import { IEvents } from '../base/events';
import * as events from 'node:events';
import { ProductView, ProductViewType } from '../view/productView';
import { cloneTemplate } from '../../utils/utils';
import { CatalogView } from '../view/catalogView';
import { ModalManagementService } from '../../utils/modalManagementService';
import { Console } from 'node:console';
import { ProductModel } from '../dataClasses/productModel';
import { string } from 'yup';
import { isModel } from '../base/Model';
import { ProductPreviewView } from '../view/productPreviewView';
import { ProductCatalogView } from '../view/productCatalogView';

export class CatalogPresenter {
	private _events: IEvents;
	private _modalService: ModalManagementService;
	private _productsData: IProductsData;
	private _catalogView: ICatalog;
	private _catalogItemTemplate: HTMLTemplateElement;
	private _catalogContainer: HTMLElement;
	private _productCardTemplate: HTMLTemplateElement

	private _selectedProduct: HTMLElement = null;

	constructor(events: IEvents,
							modalService: ModalManagementService,
							catalog: ICatalog,
							productsData: IProductsData,
							productTemplate: HTMLTemplateElement,
							productCardTemplate: HTMLTemplateElement) {
		this._events = events;
		this._modalService = modalService;
		this._productsData = productsData;
		this._catalogView = catalog;
		this._catalogItemTemplate = productTemplate;
		this._productCardTemplate = productCardTemplate;

		this.subscribeToDataEvents();
		this.subscribeToViewEvents();
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

	private subscribeToViewEvents(): void {

		return;
	}
}