import { IProduct, IProductsData, ProductsDataEvents, } from "../../types";
import { IEvents } from "../base/events";

export class ProductsData implements IProductsData {
  private readonly _events: IEvents;
  private readonly _products: IProduct[];

  constructor (events: IEvents, products: IProduct[] = []) {
    this._events = events;
    this._products = products;
    if (this._products.length > 0){
      this._events.emit(ProductsDataEvents.CatalogChanged, this._products);
    }
  }

  addProducts(products: IProduct[]): void {
    this._products.push(...products);
    this._events.emit(ProductsDataEvents.CatalogChanged, this._products);
  }

  getProduct(id: string): IProduct|null {
    const product = this._products.find(p => p.id === id);
    return product ?? null;
  }
}