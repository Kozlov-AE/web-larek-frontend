import { EventEmitter } from './components/base/events';
import { OrderingData } from './components/dataClasses/orderingData';
import { ProductsData } from './components/dataClasses/productsData';
import { LarekApi } from './components/larekApi';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { ValidationService } from './utils/validationService';
import { CatalogView } from './components/view/catalogView';
import { CatalogPresenter } from './components/presenter/catalogPresenter';
import { BasketButtonView } from './components/view/basketButtonView';
import { OrderingPresenter } from './components/presenter/orderingPresenter';
import { ModalManagementService } from './utils/modalManagementService';
import { ModalView } from './components/view/modalView';
import { ProductModel } from './components/dataClasses/productModel';
import { BasketView } from './components/view/basketView';

// Инициализация базовых классов и сервисов
const events = new EventEmitter();
const validationService= new ValidationService();
const api = new LarekApi(API_URL);

// Инициализация классов данных
const productsData = new ProductsData(events);
const orderingData = new OrderingData(events, validationService);

// Инициализация компонентов отображения
const catalogView = new CatalogView(document.querySelector('.gallery'));
const basketButtonView = new BasketButtonView(document.querySelector('.header__container'), events)
const modalView = new ModalView(document.querySelector('#modal-container'), events);

// Подписка на события клавиатуры
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    modalView.hide();
  }
});

// Инициализация презентера
const modalService = new ModalManagementService(modalView, events, productsData, orderingData, document.querySelectorAll('template'));
const catalogPresenter: CatalogPresenter
  = new CatalogPresenter(events, modalService, catalogView, productsData, document.querySelector('#card-catalog'), document.querySelector('#card-preview'));
const orderingPresenter: OrderingPresenter
  = new OrderingPresenter(events, modalService, orderingData, basketButtonView, productsData, document.querySelector('#basket'), document.querySelector('#card-basket'));

// Загрузить данные с сервера
api.getProductList().then(res => {
  productsData.addProducts(res.map(item => new ProductModel(item, events)));
})


