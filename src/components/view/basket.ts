import { IOrdering, IProduct } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class Basket extends Component<IOrdering> {
  private _items: HTMLElement;
  private _totalCount: HTMLElement;
  private _totalCost: HTMLElement;
  private _toOrderButton: HTMLButtonElement;

  constructor (container: HTMLElement, events: IEvents){
    super(container);
  }

  set items(items: HTMLElement[]) {
    super.
  }

}