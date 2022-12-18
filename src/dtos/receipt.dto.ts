import { Receipt } from "../models/receipt.model";
import { ReceiptDetailDTO } from "./receipt_detail.dto";
import { UserDTO } from "./user.dto";

export class ReceiptDTO {
  id!: number;
  details!: ReceiptDetailDTO[];
  created_at!: Date;
  total: number;
  user: UserDTO;
  tax: number;
  taxtPercentage: string;
  subtotal: number;

  constructor(receipt: Receipt) {
    this.id = receipt.id;
    this.details = receipt.details.map((rd) => new ReceiptDetailDTO(rd));
    this.created_at = receipt.created_at;
    this.total = +this.details
      .reduce((prev, next) => prev + next.total, 0)
      .toFixed(2);
    this.user = new UserDTO(receipt.user);
    this.tax = this.details[0].tax;
    this.subtotal = this.total * (1 - this.tax);
    this.taxtPercentage = (this.tax * 100).toFixed(2);
  }
}
