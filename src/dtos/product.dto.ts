import { Product } from "../models/product.model";

export class ProductDTO {
  code: string;
  description: string;
  price: number;
  quantity: number;
  active: number;
  created_at: Date;

  constructor(product: Product) {
    this.code = product.code;
    this.description = product.description;
    this.price = product.price;
    this.quantity = product.quantity;
    this.created_at = product.created_at;
    this.active = product.active;
  }
}
