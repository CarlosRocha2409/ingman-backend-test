import { ReceiptDetail } from "../models/receipt_detail.model";
import { ProductDTO } from "./product.dto";

export class ReceiptDetailDTO {
  id!: number;
  product!: ProductDTO;
  tax!: number;
  quantity!: number;
  subtotal!: number;
  total!: number;
  created_at: Date;
  taxtPercentage: string;

  constructor(receiptDetail: ReceiptDetail) {
    this.id = receiptDetail.id;
    this.product = new ProductDTO(receiptDetail.product);
    this.tax = receiptDetail.tax;
    this.quantity = receiptDetail.quantity;
    this.subtotal = receiptDetail.subtotal;
    this.total = +(receiptDetail.subtotal * (1 + receiptDetail.tax)).toFixed(2);
    this.taxtPercentage = (this.tax * 100).toFixed(2);
    this.created_at = receiptDetail.created_at;
  }
}
