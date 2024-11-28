import { IProduct, IProductsData, ProductsDataEvents, } from "../../types";
import { IEvents } from "../base/events";

export class ProductsData implements IProductsData {
  readonly #events: IEvents;
  readonly #products: IProduct[];
  #selectedProduct: IProduct;

  constructor (events: IEvents, products: IProduct[] = []) {
    this.#events = events;
    this.#products = products;
    if (this.#products.length > 0){
      this.#events.emit(ProductsDataEvents.CatalogChanged, this.#products);
    }
  }

  addProducts(products: IProduct[]): void {
    this.#products.push(...products);
    this.#events.emit(ProductsDataEvents.CatalogChanged, this.#products);
  }

  getProduct(id: string): IProduct|null {
    const product = this.#products.find(p => p.id === id);
    return product ?? null;
  }

  getProducts(): IProduct[] {
    return this.#products;
  }

  selectProduct(id: string): void {
    const product = this.getProduct(id);
    if (product != null) {
      this.#selectedProduct = product;
      this.#events.emit(ProductsDataEvents.SelectProduct, this.#selectedProduct);
    }
  }

  deselectProduct(): void {
    this.#selectedProduct = null;
    this.#events.emit(ProductsDataEvents.DeselectProduct);
  }
}