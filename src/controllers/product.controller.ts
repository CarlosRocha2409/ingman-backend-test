import { Response, Request, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { OK } from "../types/error.type";

export default class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  getById = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .findById(+req.params.productId)
      .then((product) => {
        res.status(OK).json(product);
      })
      .catch((e) => next(e));
  };

  getByCode = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .findByCode(req.params.productCode)
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
        code: req.params.productCode,
        ...req.body,
      })
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };

  delete = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .delete(req.params.productCode)
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };
}
