import { ApiError } from "../error-handling/ApiError";
import receiptRepository from "../repository/receipt.repository";
import { BAD_REQUEST, INTERNAL_SERVER } from "../types/error.type";
import logger from "../logger/api.logger";
import { ReceiptDTO } from "../dtos/receipt.dto";
import { PaginationDTO } from "../dtos/pagination.dto";
import { Receipt } from "../models/receipt.model";
import { validateFields } from "../utils/validation.util";
import { UserService } from "./user.service";

export class ReceiptService {
  repo: typeof receiptRepository;
  userService: UserService;

  constructor() {
    this.repo = receiptRepository;
    this.userService = new UserService();
  }

  async findById(receiptId: number) {
    return this.repo
      .findOne({
        where: {
          id: receiptId,
        },
        relations: {
          details: true,
        },
      })
      .then((receipt) => {
        if (!receipt)
          throw new ApiError(
            `Product with id ${receiptId} not found`,
            BAD_REQUEST
          );
        return new ReceiptDTO(receipt);
      })
      .catch((e) => {
        logger.error(`Error getting product with id ${receiptId}:: ${e} `);
        throw new ApiError(
          `Error getting product with id ${receiptId}`,
          INTERNAL_SERVER
        );
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
        skip: page - 1,
        take: 10,
        where: {
          active: 1,
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
      .catch(() => {
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
}
