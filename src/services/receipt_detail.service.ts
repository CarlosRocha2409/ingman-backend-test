import { ApiError } from "../error-handling/ApiError";
import ReceiptDetailRepository from "../repository/receipt_detail.repository";
import logger from "../logger/api.logger";
import { BAD_REQUEST, INTERNAL_SERVER } from "../types/error.type";
import { ReceiptDetailDTO } from "../dtos/receipt_detail.dto";
import { ReceiptDetail } from "../models/receipt_detail.model";
import { validateFields } from "../utils/validation.util";
import { ProductService } from "./product.service";
import { ReceiptService } from "./receipt.service";

export class ReceiptDetailService {
  repo: typeof ReceiptDetailRepository;
  productService: ProductService;
  receiptService: ReceiptService;

  constructor() {
    this.repo = ReceiptDetailRepository;
    this.productService = new ProductService();
    this.receiptService = new ReceiptService();
  }

  async findById(id: number) {
    if (!id) throw new ApiError("Please provide a valid Id");

    return this.repo
      .findOneBy({ id })
      .then((detail) => {
        if (!detail)
          throw new ApiError(
            `Receipt Detail with id ${id} not found`,
            BAD_REQUEST
          );
        return new ReceiptDetailDTO(detail);
      })
      .catch((e) => {
        logger.error(`Error getting receipt detail with id ${id}:: ${e} `);
        throw new ApiError(
          `Error getting product with id ${id}`,
          INTERNAL_SERVER
        );
      });
  }

  async findByRecipt(reciptId: number) {
    if (!reciptId) throw new ApiError("Please provide a valid Id");
    return this.repo
      .findByReceipt(reciptId)
      .then((details) => {
        return details.map((d) => new ReceiptDetailDTO(d));
      })
      .catch(() => {
        logger.error(`Error getting receipt details`);
        throw new ApiError(`Error getting receipt details`, INTERNAL_SERVER);
      });
  }

  private async validateInsertMany(details: ReceiptDetail[]) {
    for (let detail of details) {
      validateFields({
        fields: ["productId", "receiptId", "quantity"],
        item: detail,
        action: "inserting many",
        itemName: "receipt details",
      });
      await this.productService.findById(detail.id);
      await this.receiptService.findById(detail.receiptId);
    }
  }
  async insertMany(details: ReceiptDetail[]) {
    await this.validateInsertMany(details);
    return this.repo
      .insert(details)
      .then(() => ({
        id: details[0].id,
      }))
      .catch(() => {
        logger.error(`Error inserting receipt details`);
        throw new ApiError(`Error inserting receipt details`, INTERNAL_SERVER);
      });
  }
}
