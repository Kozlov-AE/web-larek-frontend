import { FormValidationEvents, IOrdering, IOrderingData, IProduct, OrderingDataEvents, TClientDetails, TErroredField, TOrderDetails, ValidationErrorFields } from "../../types";
import { ValidationService } from "../../utils/validationService";
import { IEvents } from "../base/events";

export class OrderingData implements IOrderingData {
  private readonly _events: IEvents;
  private readonly _validator: ValidationService;
  private _basket: IProduct[] = [];
  private _orderingDetails: TOrderDetails = {payment: 'cash', address: ''};
  private _clientDetails: TClientDetails = {email: '', phone: ''};
  private _ordering: IOrdering;

  constructor(events: IEvents, validationService: ValidationService) {
    this._events = events;
    this._validator = validationService;
  }

  async setOrderDetails(details: TOrderDetails, isEmptyCheck = false): Promise<void> {
    this._orderingDetails.payment = details.payment;
    this._orderingDetails.address = details.address;
    const errors: TErroredField[] = [];
    const prs: Promise<void>[] = [];

    const pr1 = this._validator.checkNonEmptyString(details.payment)
    .then(x => {
      if(!x){
        errors.push({field: ValidationErrorFields.PaymentType, message: 'Не верный способ оплаты!'});
      }
    })
    .catch(x => {
      this.writeException(x);
    });
    prs.push(pr1);

    if(details.address != '' || isEmptyCheck)
      {
        const pr2 = this._validator.checkNonEmptyString(details.address)
        .then(x => {
          if(!x) {
            errors.push({field: ValidationErrorFields.Address, message: 'Адрес не может быть пустым!'});
          }
        })
        .catch(x => {
          this.writeException(x);
        });
        prs.push(pr2);
      }

      Promise.all(prs).then(() => {
        if(errors.length > 0) {
          this._events.emit(FormValidationEvents.ValidationError, errors);
        } else {
          this._events.emit(FormValidationEvents.ValidationSuccess, this._orderingDetails);
        }
      });
  }

  get orderDetails () {
    return this._orderingDetails;
  }

  async setClientDetails(details: TClientDetails, isEmptyCheck = false): Promise<void> {
    this._clientDetails.email = details.email;
    this._clientDetails.phone = details.phone;
    const errors: TErroredField[] = [];
    const prs: Promise<void>[] = [];

    if(details.email !== '' || isEmptyCheck) {
      const pr1 = this._validator.checkEmail(details.email)
        .then((x) => {
          if(!x){
            errors.push({field: ValidationErrorFields.Email, message: 'Не верный email!'});
          }
        })
        .catch(x => {
          this.writeException(x);
      });
      prs.push(pr1);
    }

    if(details.phone !== '' || isEmptyCheck) {
      const pr2 = this._validator.checkPhone(details.phone)
      .then((x) => {
        if(!x){
          errors.push({field: ValidationErrorFields.Phone, message: 'Не верный номер телефона!'});
        }
      })
      .catch(x => {
        this.writeException(x);
      });
      prs.push(pr2);
    }

    Promise.all(prs).then(() => {
      if (errors.length > 0) {
        this._events.emit(FormValidationEvents.ValidationError, errors);
      } else {
        this._events.emit(FormValidationEvents.ValidationSuccess, this._clientDetails);
      }
    });
    // this._validator.checkClientDetails(details).then(x => {
    //   if(x.result) {
    //     this._events.emit(FormValidationEvents.ValidationSuccess, this._clientDetails);
    //   } else {
    //     this._events.emit(FormValidationEvents.ValidationError, [x.error]);
    //   }
    // })
  }

  get clientDetails() {
    return this._clientDetails;
  }

  getOrdering(): IOrdering {
    return {
      email: this._clientDetails.email,
      phone: this._clientDetails.phone,
      payment: this._orderingDetails.payment,
      address: this._orderingDetails.address,
      total: this.getTotal(),
      items: this._basket.map(x => x.id)
    };
  }

  async checkOrdering(): Promise<boolean> {
    const prs = [];
    const ordering = this.getOrdering();
    prs.push(this._validator.checkEmail(ordering.email));
    prs.push(this._validator.checkPhone(ordering.phone));
    prs.push(this._validator.checkNonEmptyString(ordering.payment));
    prs.push(this._validator.checkNonEmptyString(ordering.address));
    if(ordering.items.length > 0 && ordering.total > 0) {
      await Promise.all(prs).then(x => {
        return x.every(c => c);
      });
    }
    return false;
  }

  clear(): void {
    this._basket.forEach(x => x.isInTheBasket = false);
    this._basket = [];
    this._clientDetails = {email: '', phone: ''};
    this._orderingDetails = {payment: 'cash', address: ''};
    this._events.emit(OrderingDataEvents.TotalUpdated, {total: this.getTotal()});
  }

  addProduct(product: IProduct): boolean {
    this._basket.push(product);
    product.isInTheBasket = true;
    this._events.emit(OrderingDataEvents.BasketUpdated, product);
    this._events.emit(OrderingDataEvents.TotalUpdated, this.getTotal);
    return true;
  }

  deleteProduct(product: IProduct): boolean {
    const index = this._basket.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this._basket.splice(index, 1)[0];
      product.isInTheBasket = false;
      this._events.emit(OrderingDataEvents.BasketUpdated, product);
      this._events.emit(OrderingDataEvents.TotalUpdated, this.getTotal);
      return true;
    }
    return false;
  }

  getTotal(): number{
    return this._basket.reduce((sum, p) => sum + p.price, 0);
  }

  private writeException(error: string) {
    console.error(error);
  }

  get basket() {
    return this._basket;
  }
}
