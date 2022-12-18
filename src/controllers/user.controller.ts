import { Response, Request, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { OK } from "../types/error.type";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  getById = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .findById(+req.params.userId)
      .then((product) => {
        res.status(OK).json(product);
      })
      .catch((e) => next(e));
  };

  getAll = (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page as string;
    this.service
      .findAll({
        page: page ? +page : 1,
      })
      .then((products) => {
        res.status(OK).json(products);
      })
      .catch((e) => next(e));
  };

  create = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .insert(req.body)
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };

  update = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .update({
        id: req.params.userId,
        ...req.body,
      })
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };
}
