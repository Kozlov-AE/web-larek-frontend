//----------------------------- Типы, отвечающие за хранение данных и работу с Api ------------------------------
export type TPaymentType = 'card' | 'cash';

export type TProductCategory =
	| 'софт-скил'
	| 'кнопка'
	| 'хард-скил'
	| 'дополнительное'
	| 'другое';

// Перечисление для идентификаторов шаблонов модальных окон
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

export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: TProductCategory;
	price: number;
	isInTheBasket: boolean;
}

export interface IOrdering {
	email: string;
	phone: string;
	payment: TPaymentType;
	address: string;
	total: number;
	items: string[];
}

export interface IProductsData {
	addProducts(products: IProduct[]): void;
	getProduct(id: string): IProduct;
}

export interface IOrderingData {
	basket: IProduct[];
	setOrderDetails(details: TOrderDetails, isEmptyCheck: boolean): Promise<void>;
	orderDetails: TOrderDetails;
	setClientDetails(details: TClientDetails, isEmptyCheck: boolean): Promise<void>;
	clientDetails: TClientDetails;
	addProduct(product: IProduct): boolean;
	deleteProduct(product: IProduct): boolean;
	getTotal(): number;
	getOrdering(): IOrdering;
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
export type TModal = { content: HTMLElement }
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
}

// ----------Ordering ModelEvents ----------
export enum OrderingDataEvents {
	BasketUpdated = 'basket:updated',
	TotalUpdated = 'basket:total',
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
	OpenBasket = 'basket:openBasket',
	BasketAccepted = 'basket:accepted',
	PaymentFormAccepted = 'order:paymentAccepted',
	PaymentFormChanged = 'order:paymentFormChanged',
	ClientFormAccepted = 'order:clientFormAccepted',
	ClientFormChanged = 'order:clientFormChanged',
}

export enum ModalEvents {
	Closed = 'modal:closed',
	AskToClose = 'modal:askToClose'
}

// ----------Form Validation Events ----------
export enum FormValidationEvents {
	ValidationError = 'validation:error',
	ValidationSuccess = 'validation:success'
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