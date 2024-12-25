import { IEvents } from '../components/base/events';
import { CatalogPresenter } from '../components/presenter/catalogPresenter';
import { OrderingPresenter } from '../components/presenter/orderingPresenter';

export class ModalManagementService {
	private _events: IEvents;
	private _body: HTMLBodyElement
	private _modalContainer: HTMLElement;


	private _openedPopup: HTMLElement | null = null;

	constructor(events: IEvents,
							body: HTMLBodyElement) {
		this._events = events;
		this._body = body;

		this._events.on()
	}
}