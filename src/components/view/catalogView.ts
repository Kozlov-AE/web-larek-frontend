import { Component } from '../base/Component';
import { ICatalog } from '../../types';

export class CatalogView extends Component<ICatalog> {
	protected _catalog: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}

	render(data?: Partial<ICatalog>): HTMLElement {
		return super.render(data);
	}
}