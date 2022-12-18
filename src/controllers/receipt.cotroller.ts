import { Response, Request, NextFunction } from "express";
import { ReceiptService } from "../services/receipt.service";
import { OK } from "../types/error.type";

export class ReceiptController {
  private service: ReceiptService;

  constructor() {
    this.service = new ReceiptService();
  }

  getById = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .findById(+req.params.receiptId)
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
    console.log(req.body);
    this.service
      .insertWithDetails(req.body)
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };

  delete = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .delete(+req.params.receiptId)
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };
}
