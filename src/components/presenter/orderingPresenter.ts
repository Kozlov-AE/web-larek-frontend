import { IOrdering, IOrderingData, IProduct, IProductsData, OrderingDataEvents, OrderingViewEvents, ProductItemEvents, TPaymentType } from '../../types';
import { IEvents } from "../base/events";
import { BasketButtonView } from '../view/basketButtonView';
import { string } from 'yup';
import { ModalManagementService } from '../../utils/modalManagementService';
import * as events from 'node:events';
import { ProductView, ProductViewType } from '../view/productView';
import { ProductModel } from '../dataClasses/productModel';
import { isModel, Model } from '../base/Model';
import { OrderingData } from '../dataClasses/orderingData';
import { BasketView } from '../view/basketView';
import { cloneTemplate } from '../../utils/utils';

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
              //ordering: IOrdering,
              orderingData: IOrderingData,
              basketButtonView: BasketButtonView,
              productsData: IProductsData,
              basketTemplate: HTMLTemplateElement,
              productBasketTemplate: HTMLTemplateElement) {
    //this._ordering = ordering;
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
      paymentType: TPaymentType;
      phone: string;
      total: number;
    }

    this.subscribeToDataEvents();
    this.subscribeToViewEvents();
  }

  private subscribeToDataEvents() {
    this._events.on(OrderingDataEvents.ProductAdded, x => {
      console.log(x);
      console.log(this._ordering);
      this._basketButtonView.itemsCount = this._orderingData.getOrdering().items.length;
    });
    this._events.on(OrderingDataEvents.ProductDeleted, x => {
      this._basketButtonView.itemsCount = this._orderingData.getOrdering().items.length;
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

    this._events.on(OrderingViewEvents.BasketAccepted, () => {

      }
    );


  }
}