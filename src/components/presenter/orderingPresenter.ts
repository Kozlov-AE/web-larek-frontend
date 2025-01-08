import { IOrderingData, IProduct, IProductsData, OrderingDataEvents, OrderingViewEvents, ProductItemEvents, TClientDetails, TOrderDetails } from '../../types';
import { IEvents } from "../base/events";
import { BasketButtonView } from '../view/basketButtonView';
import { isModel } from '../base/Model';

export class OrderingPresenter{
  private _orderingData: IOrderingData;
  private _events: IEvents;
  private readonly _productsData: IProductsData;

  private _basketButtonView: BasketButtonView;

  constructor(events: IEvents,
              orderingData: IOrderingData,
              basketButtonView: BasketButtonView,
              productsData: IProductsData) {
    this._orderingData = orderingData;
    this._events = events;
    this._basketButtonView = basketButtonView;
    this._productsData = productsData;

    this.subscribeToDataEvents();
    this.subscribeToViewEvents();
  }

  private subscribeToDataEvents() {
    this._events.on(OrderingDataEvents.TotalUpdated, () => {
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

    this._events.on(OrderingViewEvents.PaymentFormChanged,async d => {
      await this._orderingData.setOrderDetails(d as TOrderDetails, true);
    });

    this._events.on(OrderingViewEvents.ClientFormChanged, async c => {
      await this._orderingData.setClientDetails(c as TClientDetails, true);
    });
  }
}