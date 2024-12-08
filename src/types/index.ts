//----------------------------- Типы, отвечающие за хранение данных и работу с Api ------------------------------
export type TPaymentType = 'online' | 'cash';

export type TProductCategory =
	| 'софт-скил'
	| 'кнопка'
	| 'хард-скил'
	| 'дополнительное'
	| 'другое';

export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: TProductCategory;
	price: number;
}

export function checkIProduct(obj: object): boolean {
	return 'id' in obj
			&& 'title' in obj
			&& 'description' in obj
			&& 'image' in obj
			&& 'category' in obj
			&& 'price' in obj;
}

export interface IOrdering {
	email: string;
	phone: string;
	paymentType: TPaymentType;
	address: string;
	total: number;
	items: string[];
}

export function checkIOrdering(obj: object): boolean {
	return 'email' in obj
			&& 'phone' in obj
			&& 'paymentType' in obj
			&& 'address' in obj
			&& 'total' in obj
			&& 'items' in obj;
}

export interface IProductsData {
	addProducts(products: IProduct[]): void;
	getProduct(id: string): IProduct;
	getProducts(): IProduct[]|null;
	selectProduct(id: string): void;
	deselectProduct(): void;
}

export interface IOrderingData {
	setOrderDetails(details: TOrderDetails, isEmptyCheck: boolean): Promise<void>;
	setClientDetails(details: TClientDetails, isEmptyCheck: boolean): Promise<void>;
	addProduct(productId: IProduct): void;
	deleteProduct(productId: string): void;
	getOrdering(): IOrdering;
	toOrder(): boolean;
	checkOrdering(): boolean;
	clear(): void;
}

export abstract class SendOrderingResult {
}

export class SendOrderingSuccessResult extends SendOrderingResult {
	id: string;
	total: number;
}

export class SendOrderingErrorResult extends SendOrderingResult {
	error: string;
}

// ---------- UI types ----------
export type TProductCardData = Pick<IProduct, 'id' | 'title' | 'image' | 'description' | 'category' | 'price'>;
export type TOrderDetails = Pick<IOrdering, 'paymentType' | 'address'>;
export type TClientDetails = Pick<IOrdering, 'email' | 'phone'>;

// ----------ModelEvents ----------
export enum ProductsDataEvents {
	CatalogChanged = 'products:changed',
	SelectProduct = 'products:selected',
	DeselectProduct = 'products:deselected'
}

// ----------ModelEvents ----------
export enum OrderingDataEvents {
	ProductAdded = 'basket:added',
	ProductDeleted = 'basket:deleted',
	ValidationError = 'order:validationError',
	TotalUpdated = 'basket:total'
}

// --------- ValidationErrorFields ----------
export type TErroredField = {
	field: string
}

export enum ValidationErrorFields {
	PaymentType = 'order:order__buttons',
	Address = 'order:address',
	Email = 'contacts:email',
	Phone = 'contacts:phone',
}