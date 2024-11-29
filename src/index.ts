import { EventEmitter } from './components/base/events';
import { OrderingData } from './components/dataClasses/orderingData';
import { ProductsData } from './components/dataClasses/productsData';
import './scss/styles.scss';
import { IProduct } from './types';
import { ValidationService } from './utils/validationService';

const products: IProduct[] = [
  {
    id: '1', title: 'Product 1', price: 100, description: 'Description 1', image: 'https://images.pexels.com/photos/106999/pexels-photo-106999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', category: 'софт-скил'
  },
  {
    id: '2', title: 'Product 2', price: 200, description: 'Description 2', image: 'https://images.pexels.com/photos/106999/pexels-photo-106999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', category: 'кнопка'
  }
]

const events = new EventEmitter();
const validatioService= new ValidationService();
const productsData = new ProductsData(events, products);
const  ordering = new OrderingData(events, validatioService);



productsData.addProducts(products);
console.log(productsData.getProducts());

ordering.addProduct({id: '1', title: 'Product 1', price: 100, description: 'Description 1', image: 'https://images.pexels.com/photos/106999/pexels-photo-106999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', category: 'софт-скил'});

ordering.setOrderDetails({address: 'address', paymentType: 'cash'}).then(x => {
  console.log(x);
  console.log(ordering.getOrdering());
});

ordering.setClientDetails({email: '123dd@mail.ru', phone: '23478789784978'}).then(x => {
  console.log(x);
  console.log(ordering.getOrdering());
});

ordering.setClientDetails({email: '123dd@mail.ru', phone: ''}).then(x => {
  console.log(x);
  console.log(ordering.getOrdering());
});

