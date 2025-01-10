# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Интерфейсы и типы данных, описывающие базовые данные сайта
Расположены в файле [src\types\index.ts](src\types\index.ts)
### Тип TProductCategory
Список категорий товаров. При добавлении новой категории, требуется добавить ее сначала сюда.
```typescript
export type TProductCategory =
	| 'софт-скил'
	| 'кнопка'
	| 'хард-скил'
	| 'дополнительное'
	| 'другое';
```
### Тип TPaymentType
Список способов оплаты.
```typescript
export type TPaymentType = 'online ' | 'cash';
```
### Перечисление TemplateIds
Служит для хранения статуса открытого модального окна.
```typescript
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
```

### Интерфейс IOrdering
Описание данных заказа. Является основой для отображения форм заказа
```typescript
export interface IOrdering {
	email: string;
	phone: string;
	payment: TPaymentType;
	address: string;
	total: number;
	items: string[];
}
```

### Тип TModal
Тип, хранящий данные о модальном окне
```typescript
export type TModal = { content: HTMLElement }
```

### Тип TOrderDetails
Тип, хранящий данные, выводимые в форме заказа, для уточнения адреса и способа оплаты
```typescript
export type TOrderDetails = Pick<IOrdering, 'paymentType' | 'address'>;
```

### Тип TClientDetails
Тип, хранящий данные, необходимые для заполнения информации о клиенте.
```typescript
export type TClientDetails = Pick<IOrdering, 'email' | 'phone'>;
```

### Интерфейс IOrderingData
Предназначен для предоставления методов для формирования заказа
Обязует реализовать следующие методы:
- setOrderDetails(details: TOrderDetails, isEmptyCheck: boolean): Promise<void> - Установить детали оплаты и адрес
- setClientDetails(details: TClientDetails, isEmptyCheck: boolean): Promise<void> - Установить информацию о клиенте
- addProduct(product: IProduct): boolean - добавить продукт в корзину
- deleteProduct(product: IProduct): boolean - удалить продукт из корзины
- getTotal(): number - Получить общую стоимость товаров в корзине
- getOrdering(): IOrdering - Получить данные заказа подготовленные к отправке
- checkOrdering(): Promise<boolean> - Проверить корректность заказа
- clear(): void - Очистить заказ полностью
Обязует реализовать следующие свойства:
- basket: IProduct[] - получить коллекцию товаров в корзине
- orderDetails: TOrderDetails - получить детали оплаты и адрес
- clientDetails: TClientDetails - получить информацию о клиенте

```typescript
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
```

### Интерфейс IProduct
Описание товара, продаваемого в магазине. Является основой для отображения товаров в каталоге и корзине
```typescript
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: TProductCategory;
	price: number;
	isInTheBasket: boolean;
}
```

### IProductsData
Интерфейс, описывающий коллекцию товаров, используется для отображения
Обязует реализовать методы:
- addProducts(products: IProduct[]): void - Добавление коллекции товаров в память
- getProduct(id: string): IProduct - Получить один продукт по id из памяти

```typescript
interface IProductsData {
	addProducts(products: IProduct[]): void;
	getProduct(id: string): IProduct;
}
```

### Тип SendOrderingSuccessResult
Отражает ответ сервера при успешной отправке заказа
```typescript
export type SendOrderingSuccessResult = {
	id: string;
	total: number;
}
```

### Тип SendOrderingErrorResult
Отражает ответ сервера при успешной отправке заказа
```typescript
export type SendOrderingErrorResult = {
	error: string;
}
```

## Архитектура приложения
### Базовый код

#### Класс [API](src/components/base/api.ts)
Содержит базовую логику отправки запросов.

##### Конструктор
```typescript
constructor(baseUrl: string, options: RequestInit = {}) {
```
`baseUrl` - базовый адрес сервера.
`options` - опциональный объект с заголовками запросов

##### Публичные методы
- `get` - выполняет GET запрос на переданный эндпоинт. Параметры передаем вместе с эндпоинтом
- `post`- выполняет POST запрос. Принимает эндпоинт, на который нужно передать данные. Сами данные, которые нужно отправить и третий, необязательный параметр, который может переопределить метод вызова.
- `handleResponse` - защищенный метод, используемое для обработки ответа от сервера

#### Класс [EventEmitter](src/components/base/events.ts)
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.
##### Конструктор
```typescript
constructor()
```
Ничего не принимает, служит для инициализации объекта класса

##### Публичные методы
- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - джинерик метод, устанавливающий обработчик для определенного события. Принимает имя события и метод, который нужно выполнить по событию.
- `off(eventName: EventName, callback: Subscriber)` -  отключает обработку событий для определенного подписчика. Принимает имя события и объект, который это событие обрабатывает.
- `emit<T extends object>(eventName: string, data?: T)` - джинерик метод, который инициирует событие и передает в него данные. Принимает имя события и данные, которые необходимо передать в него.
- `onAll(callback: (event: EmitterEvent) => void)` - подписаться на все события. Принимает функцию, которая будет выполняться по событию.
- `offAll()` - Отключить все события.
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса `EventEmitter` .

#### Класс [Component](src/components/base/Component.ts)
Абстрактный базовый класс, используется для управления отображением данных

##### Конструктор
```typescript
protected constructor(protected readonly container: HTMLElement)
```
Принимает HTML разметку для работы с ней.
##### Публичные методы
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключить класс
- `setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое
- `setDisabled(element: HTMLElement, state: boolean)` - Сменить статус блокировки
- `setHidden(element: HTMLElement)` - Скрыть элемент. Принимает элемент, которому устанавливает `display = 'none'`
- `setVisible(element: HTMLElement)` - Показать элемент. Принимает элемент, у которого удаляет `display = 'none'`
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - Устанавливает изображение в элемент разметки.
- `render(data?: Partial<T>): HTMLElement` - Вернуть корневой DOM-элемент

#### Класс [Model](src/components/base/Model.ts)
Базовая модель, чтобы можно было отличить ее от простых объектов с данными. Работает с `EventEmmiter` и имеет метод, с помощью которого может сообщить всем подписчикам об изменении модели.

##### Конструктор
```typescript
constructor(data: Partial<T>, protected events: IEvents)
```
Принимает данные модели и `events`.

##### Публичные методы
`emitChanges(event: string, payload?: object)` - сообщить всем,что модель изменилась

### Слой данных

#### Класс ProductsData
Отвечает за хранение и логику работы со списком продуктов на витрине магазина.\
Публичные поля дают доступ у следующим данным:
- `_products` - коллекция товаров представленных на витрине магазина.
- `_selectedProduct` - выбранный продукт, который отображается в виде карточки
Данный класс также предоставляет следующие методы для работы с хранимыми данными:
- `addProducts(products: IProducts[]): void` - добавить несколько продуктов в коллекцию
- `getProduct(id: string): IProduct` - получение продукта по id
- `selectProduct(): void` - назначить выделенный продукт
- `deselectProduct(): void` - снять выделение с продукта

#### Класс OrderingData
Отвечает за хранение и управление данными заказа.
Имеет следующие методы для работы с заказом:
- `setOrderDetails(details: TOrderDetails): IOrdering` - установка части заказа, отвечающей за адрес и способ оплаты
- `setClientDetails(details: TClientDetails): IOrdering` - установка части заказа, хранящей данные клиента
- `getOrdering(): IOrdering` - получить все данные заказа
- `addProduct(productId: string): void` - добавить продукт в корзину (заказ)
- `deleteProduct(productId: string): void` - удалить продукт из корзины (заказа)
- `toOrder(): boolean` - отправить заказ на сервер
- `checkOrdering(): boolean;` - проверить заказ
- `clear(): void` - очистить данные заказа

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс CardCatalogItem
Отвечает за отображение карточки товара в каталоге товаров. В конструкторе принимает объект реализующий тип `IProduct`.

#### Класс CardCatalog
Отвечает за отображение витрины магазина. Принимает в конструктор коллекцию `IProduct` что бы отобразить товары.

#### Класс Modal
Базовый класс, отвечающий за вывод модальных окон.
Имеет методы закрытия по клику на крестик и вне зоны самого попапа

#### Класс CardPreview
Наследуется от класса `Modal`.
Отвечает за отображение карточки товара. Имеет метод, генерирующий событие нажатия на кнопку для последующего добавления/удаления товара из корзины. В конструкторе принимает объект реализующий тип `IProduct`.
Имеет кнопку `addDeleteButton` по нажатию на которую генерируется событие изменения состояния товара (добавить или убрать из корзины)

#### Класс CardBasket
Отвечает за отображение карточки товара в корзине. В конструкторе принимает объект реализующий тип `IProduct`.
Имеет кнопку `_deleteButton` при нажатии на которую генерируется событие удаления товара из корзины

#### Класс Basket
Наследуется от класса `Modal`.
Отвечает за отображение корзины товаров состоящей из моделей `CardBasket`.
Имеет кнопку `_toOrder`, при клике на которую генерируется событие открытия следующего модального окна для заполнения форм заказа

#### Класс OrderDetails
Наследуется от класса `Modal`.
Отвечает за первый экран оформления заказа. Имеет функционал заполнения модели `TOrderDetails`. Содержит кнопку `_next`, по клику на которую происходит событие закрытие текущего модального окна и открытие нового, для заполнения информации о клиенте.
#### Класс ClientDetails
Наследуется от класса `Modal`.
Отвечает за второй экран оформления заказа. Имеет функционал заполнения модели `TClientDetails`. Содержит кнопку `_pay`, по клику на которую происходит событие  для отправки заказа на сервер и закрытие текущего модального окна. В случае успеха откроется модальное окно об успешном оформлении заказа. В случае ошибки будет выведено окно об ошибке..

#### Класс OrderSuccess
Наследуется от класса `Modal`.
Отвечает за вывод информации об отправке заказа. Содержит поле `_total`, которое отображает сумму заказа и кнопку `_done`, при клике на которую очищается заказ вместе с корзиной и прочими подробностями.

#### Класс MainPage
Отвечает за представление главной страницы сайта. Наследуется от абстрактного класса `Component`.
Содержит в себе свойства:
_basketCounter - количество товаров в корзине
_basketButton - кнопка для открытия окна корзины
_cardCatalog -  компонент, содержащий каталог товаров

### Слой коммуникации
#### Класс LarekApi
Обеспечивает взаимодействие фронетенда с бэкендом. Принимает экземпляр класса Api.
Реализует следующие методы:
- `async getProductList(): Promise<IProduct[]>` - получить список товаров
- `async postOrder(ordering: IOrdering): Promise<object>` - отправить заказ на сервер

#### Класс презентера CatalogPresenter
Отвечает за отображение каталога товаров.
##### Конструктор
`constructor(events: IEvents, catalog: ICatalog, productTemplate: HTMLTemplateElement)`
Принимает экземпляр класса `IEvents` для работы с глобальными событиями, экземпляр класса `ICatalog`, отражающий представление каталога товаров и шаблон для отображения карточки товара.
#### Класс презентера OrderingPresenter
Отвечает за отображение информации о заказе и связывает слой данных и слой отображения.
##### Конструктор
`constructor(events: IEvents, orderingData: IOrderingData, basketButtonView: BasketButtonView, productsData: IProductsData)`
Принимает экземпляр класса `IEvents` для работы с глобальными событиями, экземпляр класса `IOrderingData`, отражающий обеспечивающий методы формирования и доступа к заказу, экземпляр класса `BasketButtonView`, отражающий кнопку для открытия корзины и экземпляр класса `IProductsData`, дающий доступ к данным о продуктах представленных на витрине.
#### Класс презентера ModalPresenter
Отвечает за отображение модальных окон. Знает какие модальные окна необходимо отобразить и как их отобразить.
`constructor(modal: ModalView, events: IEvents, productsData: IProductsData, orderingData: IOrderingData, templates: NodeListOf<HTMLTemplateElement>)`
Принимает экземпляр класса `ModalView`, отражающий модальное окно, экземпляр класса `IEvents` для работы с глобальными событиями, экземпляр класса `IProductsData`, отражающий доступ к данным о продуктах представленных на витрине, экземпляр класса `IOrderingData`, отражающий обеспечивающий методы формирования и доступа к заказу, экземпляр класса `NodeListOf<HTMLTemplateElement>` - коллекция шаблонов для создания тел модальных окон.

#### Типы событий, используемые для обмена данными между слоями приложения
```typescript
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

// --------- ValidationErrorFields ----------
export enum FormValidationEvents {
	ValidationError = 'validation:error',
	ValidationSuccess = 'validation:success'
}
```
