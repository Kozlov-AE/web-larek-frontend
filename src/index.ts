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
import { ModalPresenter } from './components/presenter/modalPresenter';
import { ModalView } from './components/view/modalView';
import { OrderingViewEvents, OrderingDataEvents, IProduct } from './types';

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

events.on(OrderingViewEvents.ClientFormAccepted, () => {
  const IsValid = orderingData.checkOrdering();
  if (IsValid){
    api.postOrder(orderingData.getOrdering())
    .then(x => {
      if ('id' in x && 'total' in x) {
        events.emit(OrderingDataEvents.SuccessSent, {id: x.id, total: x.total});
        orderingData.clear();
      } else if ('error' in x) {
        events.emit(OrderingDataEvents.ErrorSent, {error: x.error});
      }
    })
    .catch(err => {
      console.error('Order result: ' + err);
      events.emit(OrderingDataEvents.ErrorSent, {error: err});
    });
  }
  else {
    console.log('Ordering data is not valid');
    events.emit(OrderingDataEvents.ErrorSent, {error: 'Ordering data is not valid'});
  }

});
// Инициализация презентера
new ModalPresenter(modalView, events, productsData, orderingData, document.querySelectorAll('template'));
new CatalogPresenter(events, catalogView, document.querySelector('#card-catalog'));
new OrderingPresenter(events, orderingData, basketButtonView, productsData);
// Загрузить данные с сервера
api.getProductList().then(res => {
  productsData.addProducts(res.map(item => item as IProduct));
}).catch(err => {
  console.error('Error loading products: ' + err);
})


