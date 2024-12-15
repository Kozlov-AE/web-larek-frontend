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
import { CatalogPresenter } from './components/presenter/catalogPresenter';

const events = new EventEmitter();
const validationService= new ValidationService();
const api = new LarekApi(API_URL)

const productsData = new ProductsData(events);
const orderingData = new OrderingData(events, validationService);

const catalogContainer = new Catalog(document.querySelector('.gallery'));
const prs: HTMLElement[] = [];
// const productTemplate:HTMLTemplateElement = document.querySelector('#card-catalog');

const catalogPresenter: CatalogPresenter
  = new CatalogPresenter(events, catalogContainer, productsData, document.querySelector('#card-catalog'));

// Загрузить данные с сервера
api.getProductList().then(res => {
  productsData.addProducts(res);
})


// Promise.all([api.getProductList()]).then(x => {
//   productsData.addProducts(x[0]);
//   x[0].forEach(product => {
//     const pr = new Product(cloneTemplate(productTemplate), events);
//     prs.push(pr.render(product));
//   })
//   catalogContainer.render({ catalog:prs });
// })

