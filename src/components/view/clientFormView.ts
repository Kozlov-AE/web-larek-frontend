import { OrderingViewEvents, TClientDetails } from "../../types";
import { IEvents } from "../base/events";
import { FormView } from "./formView";

export class ClientFormView extends FormView<TClientDetails> {
  private _email: HTMLInputElement;
  private _phone: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents, details?: TClientDetails) {
    super(container, events, details);
    this._email = this.container.querySelector('input[name="email"]');
    this._phone = this.container.querySelector('input[name="phone"]');

    if (!details) {
      this._formData = {email: '', phone: ''};
    } else {
      this.email = this._formData.email;
      this.phone = this._formData.phone;
    }

    this.container.addEventListener('submit', this.submit.bind(this));
    this.container.addEventListener('input', () => {
      this._formData.email = this._email.value;
      this._formData.phone = this._phone.value;
      this._events.emit(OrderingViewEvents.ClientFormChanged, this._formData)
    });
  }

  public set email(email: string) {
    this._email.value = email;
  }

  public set phone(phone: string) {
    this._phone.value = phone;
  }

  public reset(): void {
    this.email = '';
    this.phone = '';
    super.reset();
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this._events.emit(OrderingViewEvents.ClientFormAccepted, this._formData);
  }
}