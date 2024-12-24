import { IOrdering, IOrderingData, OrderingDataEvents, TPaymentType } from '../../types';
import { IEvents } from "../base/events";
import { BasketButtonView } from '../view/basketButtonView';
import { string } from 'yup';
import { ModalManagementService } from '../../utils/modalManagementService';
import * as events from 'node:events';

export class OrderingPresenter{
  private _ordering: IOrdering;
  private _orderingData: IOrderingData;
  private _events: IEvents;
  private _modalService: ModalManagementService

  private _basketButtonView: BasketButtonView;

  constructor(events: IEvents,
              modalService: ModalManagementService,
              //ordering: IOrdering,
              orderingData: IOrderingData,
              basketButtonView: BasketButtonView) {
    //this._ordering = ordering;
    this._orderingData = orderingData;
    this._events = events;
    this._modalService = modalService;
    this._basketButtonView = basketButtonView;

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
      this._basketButtonView.itemsCount = this._ordering.items.length;
    });
    this._events.on(OrderingDataEvents.ProductDeleted, x => {
      this._basketButtonView.itemsCount = this._ordering.items.length;
    });
  }

  private subscribeToViewEvents() {
  }
}