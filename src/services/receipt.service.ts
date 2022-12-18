import { ApiError } from "../error-handling/ApiError";
import receiptRepository from "../repository/receipt.repository";
import { BAD_REQUEST, INTERNAL_SERVER } from "../types/error.type";
import logger from "../logger/api.logger";
import { ReceiptDTO } from "../dtos/receipt.dto";
import { PaginationDTO } from "../dtos/pagination.dto";
import { Receipt } from "../models/receipt.model";
import { validateFields } from "../utils/validation.util";
import { UserService } from "./user.service";
import { ITEMS_PER_PAGE } from "../config/general.config";
import { ReceiptDetail } from "../models/receipt_detail.model";
import { ReceiptDetailService } from "./receipt_detail.service";

export class ReceiptService {
  repo: typeof receiptRepository;
  userService: UserService;
  detailService: ReceiptDetailService;

  constructor() {
    this.repo = receiptRepository;
    this.userService = new UserService();
    this.detailService = new ReceiptDetailService();
  }

  async findById(receiptId: number) {
    return this.repo
      .findOne({
        where: {
          id: receiptId,
        },
        relations: {
          user: true,
          details: {
            product: true,
          },
        },
      })
      .then((receipt) => {
        if (!receipt)
          throw new ApiError(
            `Product with id ${receiptId} not found`,
            BAD_REQUEST
          );
        return new ReceiptDTO(receipt);
      });
  }

  async findAll({ page = 1 }: { page: number }) {
    const count = await this.repo.count({
      where: {
        active: 1,
      },
    });
    return this.repo
      .find({
        order: {
          id: "DESC",
        },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        where: {
          active: 1,
        },
        relations: {
          user: true,
          details: {
            product: true,
          },
        },
      })
      .then((receipts) => {
        return new PaginationDTO(
          page,
          count,
          10,
          receipts.map((receipt) => new ReceiptDTO(receipt))
        );
      })
      .catch((e) => {
        console.log(e);
        logger.error(`Error getting receipts`);
        throw new ApiError(`Error getting receipts`, INTERNAL_SERVER);
      });
  }

  private async validateInsert(receipt: Receipt) {
    validateFields({
      fields: ["userId"],
      item: receipt,
      action: "create",
      itemName: "receipt",
    });

    await this.userService.findById(receipt.id);
  }

  async insert(receipt: Receipt) {
    await this.validateInsert(receipt);

    return this.repo
      .insert(receipt)
      .then((r) => ({
        id: r.identifiers[0],
      }))
      .catch((e) => {
        logger.error(`Error inserting receipt ${e}`);
        throw new ApiError(`Error inserting receipt`);
      });
  }

  async insertWithDetails({
    receipt,
    details,
  }: {
    receipt: Receipt;
    details: ReceiptDetail[];
  }) {
    if (!receipt || !details)
      throw new ApiError(
        "Please provide the receipt and details fields",
        BAD_REQUEST
      );
    if (!Array.isArray(details)) {
      throw new ApiError("Please provide a valid list of details", BAD_REQUEST);
    }
    const {
      id: { id },
    } = await this.insert(receipt);
    await this.detailService
      .insertMany(details.map((d) => ({ ...d, receiptId: +id })))
      .catch(async (e) => {
        await this.repo.delete({
          id,
        });
        throw e;
      });
    return { id };
  }

  private async validateUpdate(receipt: Receipt) {
    validateFields({
      fields: ["id"],
      item: receipt,
      action: "updating",
      itemName: "product",
    });

    return await this.findById(receipt.id);
  }
  async delete(receiptId: number) {
    const receipt = await this.validateUpdate({
      id: receiptId,
    } as Receipt);
    return this.repo
      .update({ id: receiptId }, { active: 0 })
      .then(async () => {
        const details = receipt.details;
        console.log(receipt);

        for (const detail of details) {
          await this.detailService.delete(detail.id);
        }
        return { id: receiptId };
      })
      .catch((e) => {
        console.log(e);
        throw new ApiError(`Error deleting receipt with code ${receiptId} `);
      });
  }
}
