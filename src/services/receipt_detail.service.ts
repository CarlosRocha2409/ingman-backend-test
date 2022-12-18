import { ApiError } from "../error-handling/ApiError";
import ReceiptDetailRepository from "../repository/receipt_detail.repository";
import logger from "../logger/api.logger";
import { BAD_REQUEST, INTERNAL_SERVER } from "../types/error.type";
import { ReceiptDetailDTO } from "../dtos/receipt_detail.dto";
import { ReceiptDetail } from "../models/receipt_detail.model";
import { validateFields } from "../utils/validation.util";
import { ProductService } from "./product.service";
import { Product } from "../models/product.model";

export class ReceiptDetailService {
  repo: typeof ReceiptDetailRepository;
  productService: ProductService;

  constructor() {
    this.repo = ReceiptDetailRepository;
    this.productService = new ProductService();
  }

  async findById(id: number) {
    if (!id) throw new ApiError("Please provide a valid Id");

    return this.repo
      .findOne({
        where: {
          id,
        },
        relations: {
          product: true,
        },
      })
      .then((detail) => {
        if (!detail)
          throw new ApiError(
            `Receipt Detail with id ${id} not found`,
            BAD_REQUEST
          );
        return new ReceiptDetailDTO(detail);
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

  private async validateInsert(detail: ReceiptDetail) {
    if (detail.quantity <= 0)
      throw new ApiError("Please input a valid quantity", BAD_REQUEST);

    validateFields({
      fields: ["productId", "receiptId", "quantity"],
      item: detail,
      action: "inserting many",
      itemName: "receipt details",
    });

    const product = await this.productService.findById(detail.productId);

    if (detail.quantity > product.quantity)
      throw new ApiError(
        `Not enough stock for product with code ${product.code}`
      );

    const receipt = await this.repo
      .findReceipt(detail.receiptId)
      .catch(() => null);
    if (!receipt) throw new ApiError(`Invalid receipt id`, BAD_REQUEST);

    return {
      ...detail,
      subtotal: product.price * detail.quantity,
      product: product as Product,
    };
  }

  private async validateInsertMany(details: ReceiptDetail[]) {
    const newDetails: ReceiptDetail[] = [];
    for (let detail of details) {
      newDetails.push(await this.validateInsert(detail));
    }
    return newDetails;
  }

  async insertMany(details: ReceiptDetail[]) {
    if (details.length === 0)
      throw new ApiError("Please provide at least 1 detail", BAD_REQUEST);
    const newDetails = await this.validateInsertMany(details);

    return this.repo
      .insert(
        newDetails.map((d) => ({
          quantity: d.quantity,
          productId: d.productId,
          receiptId: d.receiptId,
          subtotal: d.subtotal,
        }))
      )
      .then(async () => {
        for (const detail of newDetails) {
          await this.productService
            .update({
              code: detail.product.code,
              quantity: detail.product.quantity - detail.quantity,
            } as Product)
            .catch((e) => console.log(e));
        }
        return {
          id: details[0].id,
        };
      })
      .catch((e) => {
        logger.error(`Error inserting receipt details:: ${e}`);
        console.log(e);
        throw new ApiError(`Error inserting receipt details`, INTERNAL_SERVER);
      });
  }

  async delete(detailId: number) {
    const detail = await this.findById(detailId);
    this.productService.update({
      ...detail.product,
      quantity: detail.product.quantity + detail.quantity,
    } as Product);
    return {
      id: detail.id,
    };
  }
}
