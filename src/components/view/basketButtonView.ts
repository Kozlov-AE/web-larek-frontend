import { IOrdering, OrderingViewEvents } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class BasketButtonView extends Component<IOrdering> {
    private readonly _itemsCounter: HTMLElement;
    private _openButton: HTMLButtonElement;

    private _events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._events = events;

        this._itemsCounter = container.querySelector('.header__basket-counter');
        this._openButton = this.container.querySelector('.header__basket');

        this._openButton.addEventListener('click', () => {
            this._events.emit(OrderingViewEvents.OpenBasket);
        });
    }

    set itemsCount(count: number) {
        this.setText(this._itemsCounter, count);
    }
}