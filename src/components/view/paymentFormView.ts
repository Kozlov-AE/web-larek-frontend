import { OrderingViewEvents, TOrderDetails } from "../../types";
import { IEvents } from "../base/events";
import { FormView } from "./formView";

export class PaymentFormView extends FormView<TOrderDetails> {
  private _paymentCardButton: HTMLButtonElement;
  private _paymentCashButton: HTMLButtonElement;
  private _address: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents, details: TOrderDetails = null) {
    super(container, events, details);

    this._paymentCardButton = this.container.querySelector('button[name="card"]');
    this._paymentCashButton = this.container.querySelector('button[name="cash"]');
    this._address = this.container.querySelector('input[name="address"]');

    if (!details) {
      this._formData = {payment: 'cash', address: ''};
      this.toggleClass(this._paymentCashButton, 'button_alt-active');
    } else {
      this.address = this._formData.address;
      this.payment = this._formData.payment;
      this._formData.payment === 'card' ? this.toggleClass(this._paymentCardButton, 'button_alt-active') : this.toggleClass(this._paymentCashButton, 'button_alt-active');;
    }

    this.container.addEventListener('submit', this.submit.bind(this));

    this._paymentCardButton.addEventListener('click', () => {
      this.setButtonActive('card');
      this._formData.payment = 'card';
      this._events.emit(OrderingViewEvents.PaymentFormChanged, this._formData);
    });

    this._paymentCashButton.addEventListener('click', () => {
      this.setButtonActive('cash');
      this._formData.payment = 'cash';
      this._events.emit(OrderingViewEvents.PaymentFormChanged, this._formData);
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
    this.setButtonActive(type);
  }

  private setButtonActive(paymentType: string) {
    if (paymentType === 'card' && this._formData.payment !== 'card') {
      this.toggleClass(this._paymentCardButton, 'button_alt-active');
      this.toggleClass(this._paymentCashButton, 'button_alt-active');
    } else if (paymentType === 'cash' && this._formData.payment !== 'cash') {
      this.toggleClass(this._paymentCardButton, 'button_alt-active');
      this.toggleClass(this._paymentCashButton, 'button_alt-active');
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