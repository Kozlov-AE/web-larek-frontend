//----------------------------- Типы, отвечающие за хранение данных и работу с Api ------------------------------
export type TPaymentType = 'online ' | 'cash';

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

export interface IOrdering {
	email: string;
	phone: string;
	paymentType: TPaymentType;
	address: string;
	total: number;
	items: string[];

	Send(): void;
}

export interface IProductsData {
	addProducts(products: IProduct[]): void;
	getProduct(id: string): IProduct;
	getProducts(): IProduct[]|null;
	selectProduct(id: string): void;
	deselectProduct(): void;
}

export interface IOrderingData {
	setOrderDetails(details: TOrderDetails): boolean;
	setClientDetails(details: TClientDetails): boolean;
	addProduct(productId: IProduct): void;
	deleteProduct(productId: string): void;
	getOrdering(): IOrdering;
	toOrder(): boolean;
	checkOrdering(): boolean;
	clear(): void;
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
}

// --------- ValidationErrorFields ----------
export type TErroredField {
	field: string;
}
export enum ValidationErrorFields {
	PaymentType = 'order:order__buttons',
	Address = 'order:address',
	Email = 'contacts:email',
	Phone = 'contacts:phone',
}