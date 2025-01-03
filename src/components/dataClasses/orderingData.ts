import { pitch } from "mini-css-extract-plugin/types/loader";
import { IOrdering, IOrderingData, IProduct, OrderingDataEvents, TClientDetails, TErroredField, TOrderDetails, ValidationErrorFields } from "../../types";
import { ValidationService } from "../../utils/validationService";
import { IEvents } from "../base/events";

export class OrderingData implements IOrderingData {
  private readonly _events: IEvents;
  private readonly _validator: ValidationService;
  private _basket: IProduct[] = [];
  #orderingDetails: TOrderDetails = {paymentType: 'online', address: ''};
  #clientDetails: TClientDetails = {email: '', phone: ''};
  #ordering: IOrdering;

  constructor(events: IEvents, validationService: ValidationService) {
    this._events = events;
    this._validator = validationService;
  }

  async setOrderDetails(details: TOrderDetails, isEmptyCheck: boolean = false): Promise<void> {
    let error: TErroredField = {field: ''};

      await this._validator.checkNonEmptyString(details.paymentType)
      .then(x => {
        if(x){
          this.#orderingDetails.paymentType = details.paymentType;
        } else{
          error.field = ValidationErrorFields.PaymentType;
          this._events.emit(OrderingDataEvents.ValidationError, error);
        }
      })
      .catch(x => {
        this.writeException(x);
      });

    if(details.address != '' || isEmptyCheck)
      {
        await this._validator.checkNonEmptyString(details.address)
        .then(x => {
          if(x) {
            this.#orderingDetails.address = details.address;
          } else {
            error.field = ValidationErrorFields.Address;
            this._events.emit(OrderingDataEvents.ValidationError, error)
          }
        })
        .catch(x => {
          this.writeException(x);
        });
      }
  }

  async setClientDetails(details: TClientDetails, isEmptyCheck: boolean = false): Promise<void> {
    let error: TErroredField = {field: ''};

    if(details.email != '' || isEmptyCheck) {
      await this._validator.checkEmail(details.email)
        .then((x) => {
          if(x){
            this.#clientDetails.email = details.email;
          } else {
            error.field = ValidationErrorFields.Email;
            this._events.emit(OrderingDataEvents.ValidationError, error);
          }
        })
        .catch(x => {
          this.writeException(x);
      });
    }

    if(details.phone != '' || isEmptyCheck) {
      await this._validator.checkPhone(details.phone)
      .then((x) => {
        if(x){
          this.#clientDetails.phone = details.phone;
        } else {
          error.field = ValidationErrorFields.Phone;
          this._events.emit(OrderingDataEvents.ValidationError, error)
        }
      })
      .catch(x => {
        this.writeException(x);
      });
    }
  }

  getOrdering(): IOrdering {
    return {
      email: this.#clientDetails.email,
      phone: this.#clientDetails.phone,
      paymentType: this.#orderingDetails.paymentType,
      address: this.#orderingDetails.address,
      total: this.getTotal(),
      items: this._basket.map(x => x.id)
    };
  }

  toOrder(): boolean {
    throw new Error("Method not implemented.");
  }
  checkOrdering(): boolean {
    throw new Error("Method not implemented.");
  }
  clear(): void {
    this._basket = [];
    this.#clientDetails = {email: '', phone: ''};
    this.#orderingDetails = {paymentType: 'online', address: ''};
  }

  addProduct(product: IProduct): boolean {
    this._basket.push(product);
    product.isInTheBasket = true;
    this._events.emit(OrderingDataEvents.ProductAdded, product);
    this._events.emit(OrderingDataEvents.TotalUpdated, this.getTotal);
    return true;
  }

  deleteProduct(product: IProduct): boolean {
    const index = this._basket.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this._basket.splice(index, 1)[0];
      product.isInTheBasket = false;
      this._events.emit(OrderingDataEvents.ProductDeleted, product);
      this._events.emit(OrderingDataEvents.TotalUpdated, this.getTotal);
      return true;
    }
    return false;
  }

  getTotal(): number{
    return this._basket.reduce((sum, p) => sum + p.price, 0);
  }

  private writeException(error: any) {
    console.error(error);
  }

  get basket() {
    return this._basket;
  }
}
