import { IEvents } from '../components/base/events';
import { BasketView } from '../components/view/basketView';
import { ModalView } from '../components/view/modalView';
import { ProductBasketView } from '../components/view/productBasketView';
import { ProductPreviewView } from '../components/view/productPreviewView';
import { ProductView, ProductViewType } from '../components/view/productView';
import { IOrderingData, IProduct, IProductsData, isTemplateId, ModalEvents, OrderingDataEvents, OrderingViewEvents, ProductItemEvents, TemplateIds } from '../types';
import { cloneTemplate } from './utils';



export class ModalManagementService {
	private readonly _events: IEvents;
	private readonly _productsData: IProductsData;
	private readonly _orderingData: IOrderingData;


	private _modal: ModalView;
	private _openedModal: TemplateIds | null = null;

	private _templates: Map<string, HTMLTemplateElement> = new Map();

	constructor(modal: ModalView, events: IEvents, productsData: IProductsData, orderingData: IOrderingData, templates: NodeListOf<HTMLTemplateElement>) {
		this._modal = modal;
		this._events = events;
		this._productsData = productsData;
		this._orderingData = orderingData;

		this.setTemplates(templates);
		this.subscribeToEvents();
	}

	private setTemplates(templates: NodeListOf<HTMLTemplateElement>) {
		templates.forEach(t => {
			if (!isTemplateId(t.id)){
				console.warn(`Template with id ${t.id} is not a registered template id`);
			}
			this._templates.set(t.id, t)
		});
	}

	private getTemplate(id: string): HTMLTemplateElement {
		const template = this._templates.get(id);
		if (!template) {
			throw new Error(`Template with id ${id} is not registered`);
		}
		return template;
	}

	private subscribeToEvents() {
		this._events.on(ModalEvents.Closed, this.closeModal.bind(this));
		this._events.on(ProductItemEvents.ProductSelected, this.showProductPreview.bind(this));
		this._events.on(OrderingDataEvents.ProductAdded, pr => {
			if (this._openedModal === TemplateIds.CardPreview) {
				this.showProductPreview(pr as IProduct);
			}
			if (this._openedModal === TemplateIds.Basket) {
				this.showBasket();
			}
		});
		this._events.on(OrderingDataEvents.ProductDeleted, pr => {
			if (this._openedModal === TemplateIds.CardPreview) {
				this.showProductPreview(pr as IProduct);
			}
			if (this._openedModal === TemplateIds.Basket) {
				this.showBasket();
			}
		});
		this._events.on(OrderingViewEvents.OpenBasket, this.showBasket.bind(this));
	}

	private showModal(content: HTMLElement, templateId: TemplateIds) {
		this._modal.setContent(content);
		if (!this._modal.isOpened) {
			this._modal.show();
		}
		this._openedModal = templateId;
	}

	private closeModal() {
		this._openedModal = null;
	}

	private showProductPreview(product: IProduct | null) {
		if (product) {
			const productData = this._productsData.getProduct(product.id);
			const prView = new ProductPreviewView(cloneTemplate(this.getTemplate(TemplateIds.CardPreview)), this._events, productData.isInTheBasket);
			const view = prView.render(productData);
			if (!this._openedModal) {
				this.showModal(view, TemplateIds.CardPreview);
			} else if (this._openedModal === TemplateIds.CardPreview) {
				this._modal.setContent(view);
			}
		}
	}

	private updateProductPreview(product: IProduct | null) {
		if (this._openedModal === TemplateIds.CardPreview) {
			const prView = new ProductPreviewView(cloneTemplate(this.getTemplate(TemplateIds.CardPreview)), this._events, product.isInTheBasket);
			const view = prView.render(product);
			this._modal.setContent(view);
		}
	}

	private showBasket() {
		const view = new BasketView(cloneTemplate(this.getTemplate(TemplateIds.Basket)), this._events);
		const items = this._orderingData.basket.map(p => {
			return new ProductBasketView(cloneTemplate(this.getTemplate(TemplateIds.CardBasket)), this._events).render(p);
		});
		const modalBody = view.render({
			basket: items,
			totalCost: this._orderingData.getTotal()
		});
		if (this._openedModal === TemplateIds.Basket) {
			this._modal.setContent(modalBody);
		} else if (!this._openedModal) {
			this.showModal(modalBody, TemplateIds.Basket);
		}
	}
}
