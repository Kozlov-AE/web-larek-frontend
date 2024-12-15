import { EventEmitter } from './components/base/events';
import { OrderingData } from './components/dataClasses/orderingData';
import { ProductsData } from './components/dataClasses/productsData';
import { LarekApi } from './components/larekApi';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL } from './utils/constants';
import { ValidationService } from './utils/validationService';
import { Catalog } from './components/view/catalog';
import { Product } from './components/view/product';
import { cloneTemplate } from './utils/utils';

// let products: IProduct[] = [
//  {
//    id: '1', title: 'Product 1', price: 100, description: 'Description 1', image: 'https://images.pexels.com/photos/106999/pexels-photo-106999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', category: 'софт-скил'
//  },
//  {
//    id: '2', title: 'Product 2', price: 200, description: 'Description 2', image: 'https://images.pexels.com/photos/106999/pexels-photo-106999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', category: 'кнопка'
//  }
// ]


const events = new EventEmitter();
const validationService= new ValidationService();
const api = new LarekApi(API_URL)


//let products: IProduct[];
const productsData = new ProductsData(events);
const  ordering = new OrderingData(events, validationService);

const catalogContainer = new Catalog(document.querySelector('.gallery'));
const prs: HTMLElement[] = [];
const productTemplate:HTMLTemplateElement = document.querySelector('#card-catalog');

Promise.all([api.getProductList()]).then(x => {
  productsData.addProducts(x[0]);
  x[0].forEach(product => {
    const pr = new Product(cloneTemplate(productTemplate), events);
    prs.push(pr.render(product));
  })
  catalogContainer.render({ catalog:prs });
})






// productsData.addProducts(products);
// console.log(productsData.getProducts());

// ordering.addProduct({id: '1', title: 'Product 1', price: 100, description: 'Description 1', image: 'https://images.pexels.com/photos/106999/pexels-photo-106999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', category: 'софт-скил'});

// ordering.setOrderDetails({address: 'address', paymentType: 'cash'}).then(x => {
//   console.log(x);
//   console.log(ordering.getOrdering());
// });

// ordering.setClientDetails({email: '123dd@mail.ru', phone: '23478789784978'}).then(x => {
//   console.log(x);
//   console.log(ordering.getOrdering());
// });

// ordering.setClientDetails({email: '123dd@mail.ru', phone: ''}).then(x => {
//   console.log(x);
//   console.log(ordering.getOrdering());
// });

