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

  constructor(receiptDetail: ReceiptDetail) {
    this.id = receiptDetail.id;
    this.product = new ProductDTO(receiptDetail.product);
    this.tax = receiptDetail.tax;
    this.quantity = receiptDetail.quantity;
    this.subtotal = receiptDetail.subtotal;
    this.total = receiptDetail.subtotal * (1 - receiptDetail.tax);
    this.created_at = receiptDetail.created_at;
  }
}
