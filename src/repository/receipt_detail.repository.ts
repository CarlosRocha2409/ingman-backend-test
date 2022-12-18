import db from "../config/db.config";
import { Receipt } from "../models/receipt.model";
import { ReceiptDetail } from "../models/receipt_detail.model";

export default db.getRepository(ReceiptDetail).extend({
  findByReceipt(reciptId: number) {
    return this.find({
      where: {
        receiptId: reciptId,
      },
      relations: {
        product: true,
      },
    });
  },

  findReceipt(receiptId: number) {
    return db.getRepository(Receipt).findOneBy({ id: receiptId });
  },
});
