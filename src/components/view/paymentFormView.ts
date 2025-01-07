import { IOrdering, OrderingViewEvents, TErroredField, TOrderDetails } from "../../types";
import { IEvents } from "../base/events";
import { FormView } from "./formView";

export class PaymentFormView extends FormView<TOrderDetails> {
  private _paymentCardButton: HTMLButtonElement;
  private _paymentCashButton: HTMLButtonElement;
  private _address: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents, details?: TOrderDetails) {
    super(container, events, details);

    this._paymentCardButton = this.container.querySelector('button[name="card"]');
    this._paymentCashButton = this.container.querySelector('button[name="cash"]');
    this._address = this.container.querySelector('input[name="address"]');

    if (!details) {
      this._formData = {payment: 'cash', address: ''};
    } else {
      this.address = this._formData.address;
      this.payment = this._formData.payment;
    }

    this.container.addEventListener('submit', this.submit.bind(this));

    this._paymentCardButton.addEventListener('click', () => {
      this._formData.payment = 'card';
      this._events.emit(OrderingViewEvents.PaymentFormChanged, this._formData);
      this._paymentCardButton.classList.add('button_alt-active');
      this._paymentCashButton.classList.remove('button_alt-active');
    });

    this._paymentCashButton.addEventListener('click', () => {
      this._formData.payment = 'cash';
      this._events.emit(OrderingViewEvents.PaymentFormChanged, this._formData);
      this._paymentCardButton.classList.remove('button_alt-active');
      this._paymentCashButton.classList.add('button_alt-active');
    });

    this._address.addEventListener('input', () => {
      this._formData.address = this._address.value;
      this._events.emit(OrderingViewEvents.PaymentFormChanged, this._formData);
    });

    this.setButtonActive(this._formData.payment);
  }

  set address(address: string) {
    this._address.value = address;
  }

  set payment(type: string) {
    if (type === 'card') {
      this._paymentCardButton.classList.add('button_alt-active');
      this._paymentCashButton.classList.remove('button_alt-active');
      this._formData.payment = 'card';
    } else {
      this._paymentCardButton.classList.remove('button_alt-active');
      this._paymentCashButton.classList.add('button_alt-active');
      this._formData.payment = 'cash';
    }
  }

  private setButtonActive(paymentType: string) {
    if (paymentType === 'card') {
      this._paymentCardButton.classList.add('button_alt-active');
      this._paymentCashButton.classList.remove('button_alt-active');
    } else {
      this._paymentCardButton.classList.remove('button_alt-active');
      this._paymentCashButton.classList.add('button_alt-active');
    }
  }

  public reset(): void {
    this.address = '';
    this.payment = 'cash';
    super.reset();
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this._events.emit(OrderingViewEvents.PaymentFormAccepted, this._formData);
  }
}