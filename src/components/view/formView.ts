import { TErroredField } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export abstract class FormView<T> extends Component<T> {
  protected _events: IEvents;
  protected _formData: T;
  protected _errors: HTMLElement;
  protected _submitButton: HTMLButtonElement;
  protected constructor(container: HTMLElement, events: IEvents, formData?: T) {
    super(container);
    this._errors = this.container.querySelector('.form__errors');
    this._submitButton = this.container.querySelector('button[type="submit"]');

    this._events = events;
    this._formData = formData;
  }

  public setErrors(errors: TErroredField[]): HTMLElement {
    if(errors.length > 0) {
      const text = errors.map(x => `${x.message}`).join('\n');
      this.setText(this._errors, text);
      this.toggleButton(true);
    }
    else {
      this.setText(this._errors, '');
      this.toggleButton(false);
    }
    return this.render();
  }

  public resetErrors(): HTMLElement {
    this.setText(this._errors, '');
    this.toggleButton(false);
    return this.render();
  }

  protected abstract submit(event: Event): void;
  protected reset(): void{
    this.toggleButton(true);
  }

  protected toggleButton(state: boolean) {
    this.setDisabled(this._submitButton, state);
  }
}