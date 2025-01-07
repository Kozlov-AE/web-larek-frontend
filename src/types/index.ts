//----------------------------- Типы, отвечающие за хранение данных и работу с Api ------------------------------
export type TPaymentType = 'card' | 'cash';

export type TProductCategory =
	| 'софт-скил'
	| 'кнопка'
	| 'хард-скил'
	| 'дополнительное'
	| 'другое';

// Функция для проверки, принадлежит ли строка перечислению TemplateId
export function isTemplateId(id: string): id is TemplateIds {
	return Object.values(TemplateIds).includes(id as TemplateIds);
}

export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: TProductCategory;
	price: number;
	isInTheBasket: boolean;
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
	payment: TPaymentType;
	address: string;
	total: number;
	items: string[];
}

export function checkIOrdering(obj: object): boolean {
	return 'email' in obj
			&& 'phone' in obj
			&& 'payment' in obj
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
	basket: IProduct[];
	setOrderDetails(details: TOrderDetails, isEmptyCheck: boolean): Promise<void>;
	orderDetails: TOrderDetails;
	setClientDetails(details: TClientDetails, isEmptyCheck: boolean): Promise<void>;
	clientDetails: TClientDetails;
	addProduct(product: IProduct): boolean;
	deleteProduct(product: IProduct): boolean;
	getOrdering(): IOrdering;
	getTotal(): number;
	checkOrdering(): Promise<boolean>;
	clear(): void;
}

export type SendOrderingSuccessResult = {
	id: string;
	total: number;
}

export type SendOrderingErrorResult = {
	error: string;
}

// ---------- UI types ----------
export type TProductCardData = Pick<IProduct, 'id' | 'title' | 'image' | 'description' | 'category' | 'price'>;
export type TOrderDetails = Pick<IOrdering, 'payment' | 'address'>;
export type TClientDetails = Pick<IOrdering, 'email' | 'phone'>;

export interface ICatalog {
	catalog: HTMLElement[];
	render(data?: Partial<ICatalog>): HTMLElement
}

export interface IBasket {
	basket: HTMLElement[];
	totalCost: number;
	render(data?: Partial<IBasket>): HTMLElement
}

// ----------Products ModelEvents ----------
export enum ProductsDataEvents {
	CatalogChanged = 'products:changed',
	SelectProduct = 'products:selected',
	DeselectProduct = 'products:deselected'
}

// ----------Ordering ModelEvents ----------
export enum OrderingDataEvents {
	BasketUpdated = 'basket:updated',
	TotalUpdated = 'basket:total',
	ValidationError = 'order:validationError',
	SuccessSent = 'order:successSent',
	ErrorSent = 'order:errorSent',
}

// ----------View Events ----------
export enum ProductItemEvents {
	ProductSelected = 'product:selected',
	BuyProduct = 'product:buy',
	RemoveProduct = 'product:remove'
}

export enum OrderingViewEvents {
	OrderingSubmitted = 'order:submitted',
	OpenBasket = 'basket:openBasket',
	BasketAccepted = 'basket:accepted',
	PaymentFormAccepted = 'order:paymentAccepted',
	PaymentFormChanged = 'order:paymentFormChanged',
	ClientFormAccepted = 'order:clientFormAccepted',
	ClientFormChanged = 'order:clientFormChanged',
}

export enum ModalEvents {
	Opened = 'modal:opened',
	Closed = 'modal:closed',
	AskToClose = 'modal:askToClose'
}

export enum TemplateIds {
  Success = 'success',
	Error = 'error',
  CardCatalog = 'card-catalog',
  CardPreview = 'card-preview',
  CardBasket = 'card-basket',
  Basket = 'basket',
  Order = 'order',
  Contacts = 'contacts'
}


// --------- ValidationErrorFields ----------
export type TErroredField = {
	field: string;
	message: string;
}

export enum ValidationErrorFields {
	PaymentType = 'order:order__buttons',
	Address = 'order:address',
	Email = 'contacts:email',
	Phone = 'contacts:phone',
}

export enum FormValidationEvents {
	ValidationError = 'validation:error',
	ValidationSuccess = 'validation:success'
}