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

// Инициализация базовых классов и сервисов
const events = new EventEmitter();
const validationService= new ValidationService();
const api = new LarekApi(API_URL);
const modalService = new ModalManagementService()

// Инициализация классов данных
const productsData = new ProductsData(events);
const orderingData = new OrderingData(events, validationService);

// Поиск контейнеров
const catalogContainer = new CatalogView(document.querySelector('.gallery'));
const basketButtonContainer = new BasketButtonView(document.querySelector('.header__container'), events);

// Инициализация презентера
const catalogPresenter: CatalogPresenter
  = new CatalogPresenter(events, catalogContainer, productsData, document.querySelector('#card-catalog'));
const orderingPresenter: OrderingPresenter
  = new OrderingPresenter(events, orderingData, basketButtonContainer)

// Загрузить данные с сервера
api.getProductList().then(res => {
  productsData.addProducts(res);
})


