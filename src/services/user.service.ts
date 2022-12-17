import { ApiError } from "../error-handling/ApiError";
import UserRepository from "../repository/user.repository";
import { BAD_REQUEST, INTERNAL_SERVER } from "../types/error.type";
import logger from "../logger/api.logger";
import { UserDTO } from "../dtos/user.dto";

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
          throw new ApiError(
            `Product with id ${userId} not found`,
            BAD_REQUEST
          );
        return new UserDTO(user);
      })
      .catch((e) => {
        logger.error(`Error getting product with id ${userId}:: ${e} `);
        throw new ApiError(
          `Error getting product with id ${userId}`,
          INTERNAL_SERVER
        );
      });
  }
}
