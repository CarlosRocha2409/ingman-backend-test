import { Router } from "express";
import { ReceiptController } from "../controllers/receipt.cotroller";

export class ReceiptRouter {
  router: Router;
  controller: ReceiptController;

  constructor() {
    this.router = Router();
    this.controller = new ReceiptController();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.controller.getAll);
    this.router.post("/", this.controller.create);
    this.router.get("/:receiptId", this.controller.getById);
    this.router.delete("/:receiptId", this.controller.delete);
  }
}

export default new ReceiptRouter().router;
