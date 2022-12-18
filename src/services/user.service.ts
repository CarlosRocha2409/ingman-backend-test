import { ApiError } from "../error-handling/ApiError";
import UserRepository from "../repository/user.repository";
import { BAD_REQUEST, INTERNAL_SERVER } from "../types/error.type";
import logger from "../logger/api.logger";
import { UserDTO } from "../dtos/user.dto";
import { User } from "../models/user.model";
import { validateFields } from "../utils/validation.util";
import { ITEMS_PER_PAGE } from "../config/general.config";
import { PaginationDTO } from "../dtos/pagination.dto";

export class UserService {
  repo: typeof UserRepository;

  constructor() {
    this.repo = UserRepository;
  }

  async findById(userId: number) {
    return this.repo
      .findOneBy({
        id: userId,
      })
      .then((user) => {
        if (!user)
          throw new ApiError(`User with id ${userId} not found`, BAD_REQUEST);
        return new UserDTO(user);
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
      .then((users) => {
        return new PaginationDTO(
          page,
          count,
          ITEMS_PER_PAGE,
          users.map((user) => new UserDTO(user))
        );
      })
      .catch(() => {
        logger.error(`Error getting users`);
        throw new ApiError(`Error getting users`, INTERNAL_SERVER);
      });
  }

  private async validateEmail(email: string) {
    await this.repo
      .findByEmail(email)
      .then((u) => {
        if (u)
          throw new ApiError(`Email ${email} is already taken`, BAD_REQUEST);
      })
      .catch((e) => {
        logger.error(`Error validating user:: ${e}`);
        throw new ApiError(`Error validating user`, INTERNAL_SERVER);
      });
  }

  private async validateInsert(user: User) {
    validateFields({
      fields: ["name", "lastname", "email"],
      action: "creating",
      item: user,
      itemName: "user",
    });
    await this.validateEmail(user.email);
  }

  async insert(user: User) {
    await this.validateInsert(user);
    return this.repo
      .insert(user)
      .then((result) => ({
        id: result.identifiers[0],
      }))
      .catch(() => {
        throw new ApiError(`Error creating user`, INTERNAL_SERVER);
      });
  }

  private async validateUpdate(user: User) {
    validateFields({
      fields: ["id"],
      action: "updating",
      item: user,
      itemName: "user",
    });
    const u = await this.findById(user.id);
    if (user.email && user.email !== u.email)
      await this.validateEmail(user.email);
  }

  async update(user: User) {
    await this.validateUpdate(user);
    return this.repo
      .update(
        { id: user.id },
        {
          ...user,
        }
      )
      .then(() => ({ id: user.id }))
      .catch(() => {
        throw new ApiError(
          `Error updating user with code ${user.id}`,
          BAD_REQUEST
        );
      });
  }
}
