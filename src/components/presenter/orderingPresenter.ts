import { IOrdering, IOrderingData, IProduct, IProductsData, OrderingDataEvents, OrderingViewEvents, ProductItemEvents, TClientDetails, TOrderDetails, TPaymentType } from '../../types';
import { IEvents } from "../base/events";
import { BasketButtonView } from '../view/basketButtonView';
import { ModalManagementService } from '../../utils/modalManagementService';
import { isModel } from '../base/Model';

export class OrderingPresenter{
  private _ordering: IOrdering;
  private _orderingData: IOrderingData;
  private _events: IEvents;
  private _modalService: ModalManagementService
  private readonly _productsData: IProductsData;

  private readonly _basketTemplate: HTMLTemplateElement;
  private readonly _productBasketTemplate: HTMLTemplateElement

  private _basketButtonView: BasketButtonView;

  constructor(events: IEvents,
              modalService: ModalManagementService,
              orderingData: IOrderingData,
              basketButtonView: BasketButtonView,
              productsData: IProductsData,
              basketTemplate: HTMLTemplateElement,
              productBasketTemplate: HTMLTemplateElement) {
    this._orderingData = orderingData;
    this._events = events;
    this._modalService = modalService;
    this._basketButtonView = basketButtonView;
    this._productsData = productsData;

    this._basketTemplate = basketTemplate;
    this._productBasketTemplate = productBasketTemplate;

    this._ordering = new class implements IOrdering {
      address: string;
      email: string;
      items: string[];
      payment: TPaymentType;
      phone: string;
      total: number;
    }

    this.subscribeToDataEvents();
    this.subscribeToViewEvents();
  }

  private subscribeToDataEvents() {
    this._events.on(OrderingDataEvents.BasketUpdated, x => {
      console.log(this._ordering);
      this._basketButtonView.itemsCount = this._orderingData.basket.length;
    });
    this._events.on(OrderingDataEvents.TotalUpdated, x => {
      this._basketButtonView.itemsCount = this._orderingData.basket.length;
    });
  }

  private subscribeToViewEvents() {
		this._events.on(ProductItemEvents.BuyProduct, pr => {
			if (isModel(pr)) return;
			const productData = this._productsData.getProduct((pr as IProduct).id);
			if (!productData.isInTheBasket && this._orderingData.addProduct(productData)){
        productData.isInTheBasket = true;
      }
		});

		this._events.on(ProductItemEvents.RemoveProduct, pr => {
      if (isModel(pr)) return;
      const productData = this._productsData.getProduct((pr as IProduct).id);
			if (this._orderingData.deleteProduct(productData)){
        productData.isInTheBasket = false;
      }
		});

    this._events.on(OrderingViewEvents.PaymentFormChanged, d => {
      this._orderingData.setOrderDetails(d as TOrderDetails, true);
    });

    this._events.on(OrderingViewEvents.ClientFormChanged, c => {
      this._orderingData.setClientDetails(c as TClientDetails, true);
    });
  }
}