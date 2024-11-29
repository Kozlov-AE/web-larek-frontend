import { pitch } from "mini-css-extract-plugin/types/loader";
import { IOrdering, IOrderingData, IProduct, OrderingDataEvents, TClientDetails, TErroredField, TOrderDetails, ValidationErrorFields } from "../../types";
import { ValidationService } from "../../utils/validationService";
import { IEvents } from "../base/events";

export class OrderingData implements IOrderingData {
  readonly #events: IEvents;
  readonly #validator: ValidationService;
  #basket: IProduct[] = [];
  #orderingDetails: TOrderDetails = {paymentType: 'online', address: ''};
  #clientDetails: TClientDetails = {email: '', phone: ''};
  #ordering: IOrdering;

  constructor(events: IEvents, validationService: ValidationService) {
    this.#events = events;
    this.#validator = validationService;
  }

  async setOrderDetails(details: TOrderDetails, isEmptyCheck: boolean = false): Promise<void> {
    let error: TErroredField = {field: ''};

      await this.#validator.checkNonEmptyString(details.paymentType)
      .then(x => {
        if(x){
          this.#orderingDetails.paymentType = details.paymentType;
        } else{
          error.field = ValidationErrorFields.PaymentType;
          this.#events.emit(OrderingDataEvents.ValidationError, error);
        }
      })
      .catch(x => {
        this.writeException(x);
      });

    if(details.address != '' || isEmptyCheck)
      {
        await this.#validator.checkNonEmptyString(details.address)
        .then(x => {
          if(x) {
            this.#orderingDetails.address = details.address;
          } else {
            error.field = ValidationErrorFields.Address;
            this.#events.emit(OrderingDataEvents.ValidationError, error)
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
      await this.#validator.checkEmail(details.email)
        .then((x) => {
          if(x){
            this.#clientDetails.email = details.email;
          } else {
            error.field = ValidationErrorFields.Email;
            this.#events.emit(OrderingDataEvents.ValidationError, error);
          }
        })
        .catch(x => {
          this.writeException(x);
      });
    }

    if(details.phone != '' || isEmptyCheck) {
      await this.#validator.checkPhone(details.phone)
      .then((x) => {
        if(x){
          this.#clientDetails.phone = details.phone;
        } else {
          error.field = ValidationErrorFields.Phone;
          this.#events.emit(OrderingDataEvents.ValidationError, error)
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
      items: this.#basket.map(x => x.id)
    };
  }

  toOrder(): boolean {
    throw new Error("Method not implemented.");
  }
  checkOrdering(): boolean {
    throw new Error("Method not implemented.");
  }
  clear(): void {
    this.#basket = [];
    this.#clientDetails = {email: '', phone: ''};
    this.#orderingDetails = {paymentType: 'online', address: ''};

  }

  addProduct(product: IProduct): void {
    this.#basket.push(product);
    this.#events.emit(OrderingDataEvents.ProductAdded, product);
    this.#events.emit(OrderingDataEvents.TotalUpdated, this.getTotal);
  }

  deleteProduct(id: string){
    const index = this.#basket.findIndex(p => p.id === id);
    if (index !== -1) {
      const deletedProduct = this.#basket.splice(index, 1)[0];
      this.#events.emit(OrderingDataEvents.ProductDeleted, deletedProduct);
      this.#events.emit(OrderingDataEvents.TotalUpdated, this.getTotal);
    }
  }

  getTotal(): number{
    return this.#basket.reduce((sum, p) => sum + p.price, 0)
  }

  private writeException(error: any) {
    console.error(error);
  }

}
