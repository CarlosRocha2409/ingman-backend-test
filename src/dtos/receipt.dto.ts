import { Receipt } from "../models/receipt.model";
import { User } from "../models/user.model";
import { ReceiptDetailDTO } from "./receipt_detail.dto";

export class ReceiptDTO {
  id!: number;
  user!: User;
  details!: ReceiptDetailDTO[];
  created_at!: Date;
  constructor(receipt: Receipt) {
    this.id = receipt.id;
    this.user = receipt.user;
    this.details = receipt.details.map((rd) => new ReceiptDetailDTO(rd));
    this.created_at = receipt.created_at;
  }
}
