import { object } from "yup";
import { IOrdering, IOrderingData, IProduct, OrderingDataEvents, TClientDetails, TErroredField, TOrderDetails, ValidationErrorFields } from "../../types";
import { ValidationService } from "../../utils/validationService";
import { IEvents } from "../base/events";

export class OrderingData implements IOrderingData {
  readonly #events: IEvents;
  readonly #validator: ValidationService;
  #basket: IProduct[] = [];
  #orderingDetails: TOrderDetails = null;
  #clientDetails: TClientDetails = null;
  #ordering: IOrdering;

  constructor(events: IEvents, validationService: ValidationService) {
    this.#events = events;
    this.#validator = validationService;
    this.#ordering.items = [];
  }

  setOrderDetails(details: TOrderDetails): boolean {
    let error: TErroredField;

    this.#validator.checkNonEmptyString(details.paymentType).catch(x => {
      error.field = ValidationErrorFields.PaymentType;
      this.#events.emit(OrderingDataEvents.ValidationError, error);
      return false;
    });

    this.#validator.checkNonEmptyString(details.address).catch(x => {
      error.field = ValidationErrorFields.Address;
      this.#events.emit(OrderingDataEvents.ValidationError, error)
      return false;
    });

    this.#orderingDetails = details;
    return true;
  }

  setClientDetails(details: TClientDetails): boolean {
    throw new Error("Method not implemented.");
  }
  getOrdering(): IOrdering {
    throw new Error("Method not implemented.");
  }
  toOrder(): boolean {
    throw new Error("Method not implemented.");
  }
  checkOrdering(): boolean {
    throw new Error("Method not implemented.");
  }
  clear(): void {
    throw new Error("Method not implemented.");
  }

  addProduct(product: IProduct): void {
    this.#basket.push(product);
    this.#events.emit(OrderingDataEvents.ProductAdded, product);
  }

  deleteProduct(id: string){
    const index = this.#basket.findIndex(p => p.id === id);
    if (index !== -1) {
      const deletedProduct = this.#basket.splice(index, 1)[0];
      this.#events.emit(OrderingDataEvents.ProductDeleted, deletedProduct);
    }
  }



}
