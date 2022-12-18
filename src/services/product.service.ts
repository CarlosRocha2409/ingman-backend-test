import { Repository } from "typeorm";
import { ProductDTO } from "../dtos/product.dto";
import { ApiError } from "../error-handling/ApiError";
import { Product } from "../models/product.model";
import productRepository from "../repository/product.repository";
import { BAD_REQUEST, INTERNAL_SERVER } from "../types/error.type";
import logger from "../logger/api.logger";
import { PaginationDTO } from "../dtos/pagination.dto";
import { validateFields } from "../utils/validation.util";
import { ITEMS_PER_PAGE } from "../config/general.config";

export class ProductService {
  repo: Repository<Product>;

  constructor() {
    this.repo = productRepository;
  }

  private validateInsert(product: Product) {
    validateFields({
      fields: ["description", "price", "quantity", "code"],
      item: product,
      action: "creating",
      itemName: "product",
    });
  }

  private async validateUpdate(product: Product) {
    validateFields({
      fields: ["code"],
      item: product,
      action: "updating",
      itemName: "product",
    });

    await this.repo.findOneBy({ code: product.code }).then((p) => {
      if (!p) throw new ApiError(`Product with code ${product.code} not found`);
    });
  }

  async findById(id: number) {
    if (!id) throw new ApiError("Please provide a valid Id");

    return this.repo.findOneBy({ id, active: 1 }).then((product) => {
      if (!product)
        throw new ApiError(`Product with id ${id} not found`, BAD_REQUEST);
      return new ProductDTO(product);
    });
  }

  async findByCode(code: string) {
    if (!code) throw new ApiError("Please provide a valid code");

    return this.repo
      .findOneBy({ code })
      .then((product) => {
        if (!product)
          throw new ApiError(
            `Product with code ${code} not found`,
            BAD_REQUEST
          );
        return new ProductDTO(product);
      })
      .catch((e) => {
        logger.error(`Error getting product with code ${code}:: ${e} `);
        throw new ApiError(
          `Error getting product with code ${code}`,
          INTERNAL_SERVER
        );
      });
  }

  async findAll({ page = 1 }: { page?: number }) {
    const count = await this.repo.count({
      where: {
        active: 1,
      },
    });
    return this.repo
      .find({
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        where: {
          active: 1,
        },
      })
      .then((products) => {
        return new PaginationDTO(
          page,
          count,
          ITEMS_PER_PAGE,
          products.map((product) => new ProductDTO(product))
        );
      })
      .catch(() => {
        logger.error(`Error getting products`);
        throw new ApiError(`Error getting products`, INTERNAL_SERVER);
      });
  }

  async insert(product: Product) {
    this.validateInsert(product);

    await this.repo
      .findOneBy({ code: product.code })
      .then((p) => {
        if (p)
          throw new ApiError(`Product with code ${product.code} already exist`);
      })
      .catch(() => null);

    return this.repo
      .insert(product)
      .then((result) => ({
        id: result.identifiers[0],
      }))
      .catch(() => {
        throw new ApiError(`Error creating product`, INTERNAL_SERVER);
      });
  }

  async update(product: Product) {
    await this.validateUpdate(product);
    const { code, ...prod } = product;
    return this.repo
      .update(
        { code },
        {
          ...prod,
        }
      )
      .then(() => ({ code: product.code }))
      .catch(() => {
        throw new ApiError(
          `Error updating product with code ${product.code}`,
          BAD_REQUEST
        );
      });
  }

  async updateMany(products: Product[]) {
    for (const product of products) {
      await this.update(product);
    }
  }

  async delete(code: string) {
    await this.validateUpdate({
      code,
    } as Product);
    return this.repo
      .update({ code }, { active: 0 })
      .then(() => ({ code }))
      .catch(() => {
        throw new ApiError(`Error deleting product with code ${code} `);
      });
  }
}
