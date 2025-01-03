import { IProduct, TProductCategory } from "../../types";
import { Model } from "../base/Model";

export class ProductModel extends Model<IProduct> implements IProduct {
  isInTheBasket: boolean;
  id: string;
  title: string;
  description: string;
  image: string;
  category: TProductCategory;
  price: number;
}