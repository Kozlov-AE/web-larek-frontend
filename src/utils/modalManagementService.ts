import { IEvents } from '../components/base/events';
import { CatalogPresenter } from '../components/presenter/catalogPresenter';
import { OrderingPresenter } from '../components/presenter/orderingPresenter';

export class ModalManagementService {
	private _events: IEvents;
	private _modalContainer: HTMLElement;
	private _catalogPresenter: CatalogPresenter;
	private _orderingPresenter: OrderingPresenter

	private _openedPopup: HTMLElement | null = null;

	constructor(events: IEvents,
							modalContainer: HTMLElement,
							catalogPresenter: CatalogPresenter,
							orderingPresenter: OrderingPresenter) {
		this._events = events;
		this._modalContainer = modalContainer;
		this._catalogPresenter = catalogPresenter;
		this._orderingPresenter = orderingPresenter;
	}
}