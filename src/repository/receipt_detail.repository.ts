import db from "../config/db.config";
import { ReceiptDetail } from "../models/receipt_detail.model";

export default db.getRepository(ReceiptDetail).extend({
  findByReceipt(reciptId: number) {
    return this.findBy({ receiptId: reciptId });
  },
});
