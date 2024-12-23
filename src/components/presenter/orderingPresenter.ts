import { IOrdering, IOrderingData, OrderingDataEvents } from '../../types';
import { IEvents } from "../base/events";
import { BasketButtonView } from '../view/basketButtonView';

export class OrderingPresenter{
  private _ordering: IOrdering;
  private _orderingData: IOrderingData;
  private _events: IEvents;

  private _basketButtonView: BasketButtonView;

  constructor(events: IEvents,
              ordering: IOrdering,
              orderingData: IOrderingData,
              basketButtonView: BasketButtonView) {
    this._ordering = ordering;
    this._orderingData = orderingData;
    this._events = events;
    this._basketButtonView = basketButtonView;

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
    return;
  }
}