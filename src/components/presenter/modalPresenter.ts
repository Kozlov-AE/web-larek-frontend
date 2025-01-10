import { IEvents } from '../base/events';
import { BasketView } from '../view/basketView';
import { ClientFormView } from '../view/clientFormView';
import { ErrorView } from '../view/errorView';
import { ModalView } from '../view/modalView';
import { PaymentFormView } from '../view/paymentFormView';
import { ProductBasketView } from '../view/productBasketView';
import { ProductPreviewView } from '../view/productPreviewView';
import { SuccessView } from '../view/successView';
import { FormValidationEvents, IOrderingData, IProduct, IProductsData, ModalEvents, OrderingDataEvents, OrderingViewEvents, ProductItemEvents, SendOrderingErrorResult, SendOrderingSuccessResult, TemplateIds, TErroredField } from '../../types';
import { cloneTemplate, isTemplateId } from '../../utils/utils';

export class ModalPresenter {
	private readonly _events: IEvents;
	private readonly _productsData: IProductsData;
	private readonly _orderingData: IOrderingData;


	private _modal: ModalView;
	private _openedModal: TemplateIds | null = null;

	private _templates: Map<string, HTMLTemplateElement> = new Map();

	private _basketBody: BasketView;
	private _paymentForm: PaymentFormView;
	private _clientForm: ClientFormView;
	private _successBody: SuccessView;
	private _errorBody: ErrorView;

	constructor(modal: ModalView, events: IEvents, productsData: IProductsData, orderingData: IOrderingData, templates: NodeListOf<HTMLTemplateElement>) {
		this._modal = modal;
		this._events = events;
		this._productsData = productsData;
		this._orderingData = orderingData;

		this.setTemplates(templates);

		this._basketBody = new BasketView(cloneTemplate(this.getTemplate(TemplateIds.Basket)), this._events);
		this._paymentForm = new PaymentFormView(cloneTemplate(this.getTemplate(TemplateIds.Order)), this._events, this._orderingData.orderDetails);
		this._clientForm = new ClientFormView(cloneTemplate(this.getTemplate(TemplateIds.Contacts)), this._events);
		this._successBody = new SuccessView(cloneTemplate(this.getTemplate(TemplateIds.Success)), this._events);
		this._errorBody = new ErrorView(cloneTemplate(this.getTemplate(TemplateIds.Error)), this._events);

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

		this._events.on(OrderingDataEvents.BasketUpdated, pr => {
			if (this._openedModal === TemplateIds.CardPreview) {
				this.showProductPreview(pr as IProduct);
			}
			if (this._openedModal === TemplateIds.Basket) {
				this.showBasket();
			}
		});

		this._events.on(OrderingViewEvents.OpenBasket, this.showBasket.bind(this));

		this._events.on(OrderingViewEvents.BasketAccepted, this.showPaymentForm.bind(this));

		this._events.on(FormValidationEvents.ValidationError, this.showError.bind(this));

		this._events.on(FormValidationEvents.ValidationSuccess, this.formValidationSuccess.bind(this));

		this._events.on(OrderingViewEvents.PaymentFormAccepted, this.showContactsForm.bind(this));

		this._events.on(OrderingDataEvents.SuccessSent, this.showSentSuccess.bind(this));

		this._events.on(OrderingDataEvents.ErrorSent, this.showSentError.bind(this));

		this._events.on(ModalEvents.AskToClose, () => {
			this._modal.hide();
		});
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
			if (!productData.price) {
				prView.StopBuy();
			}
			const view = prView.render(productData);
			if (!this._openedModal) {
				this.showModal(view, TemplateIds.CardPreview);
			} else if (this._openedModal === TemplateIds.CardPreview) {
				this._modal.setContent(view);
			}
		}
	}

	private showBasket() {
		const items = this._orderingData.basket.map((p, index) => {
			const pr = new ProductBasketView(cloneTemplate(this.getTemplate(TemplateIds.CardBasket)), this._events);
			pr.index = index + 1;
			return pr.render(p);
		});
		const modalBody = this._basketBody.render({
			basket: items,
			totalCost: this._orderingData.getTotal()
		});
		if (!this._openedModal
			|| this._openedModal === TemplateIds.Basket
			|| this._openedModal === TemplateIds.Error) {
			this.showModal(modalBody, TemplateIds.Basket);
		}
	}

	private showPaymentForm() {
		const orderDetails = this._orderingData.orderDetails;

		const modalBody = this._paymentForm.render(orderDetails);

		if (this._openedModal === TemplateIds.Basket || this._openedModal === TemplateIds.Order) {
			this.showModal(modalBody, TemplateIds.Order);
		}
	}

	private showContactsForm() {
		const clientDetails = this._orderingData.clientDetails;
		const modalBody = this._clientForm.render(clientDetails);

		if (this._openedModal === TemplateIds.Order || this._openedModal === TemplateIds.Contacts) {
			this.showModal(modalBody, TemplateIds.Contacts);
		}
	}

	private showSentSuccess(data: SendOrderingSuccessResult) {
		this.showModal(this._successBody.render(data), TemplateIds.Success);
		this._clientForm.reset();
		this._paymentForm.reset();
	}

	private showSentError(data: SendOrderingErrorResult) {
		this.showModal(this._errorBody.render(data), TemplateIds.Error);
	}

	private showError(errors: TErroredField[]) {
		switch (this._openedModal) {
			case TemplateIds.Order:
				this._paymentForm.setErrors(errors);
				break;
			case TemplateIds.Contacts:
				this._clientForm.setErrors(errors);
				break;
			default:
				break;
		}
	}

	private formValidationSuccess() {
		switch (this._openedModal) {
			case TemplateIds.Order:
				this._paymentForm.resetErrors();
				break;
			case TemplateIds.Contacts:
				this._clientForm.resetErrors();
				break;
			default:
				break;
		}
	}
}
