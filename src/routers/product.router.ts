import { Router } from "express";
import ProductController from "../controllers/product.controller";

export class ProductRouter {
  router: Router;
  controller: ProductController;

  constructor() {
    this.router = Router();
    this.controller = new ProductController();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.controller.getAll);
    this.router.post("/", this.controller.create);
    this.router.get("/:productCode", this.controller.getByCode);
    this.router.put("/:productCode", this.controller.update);
    this.router.delete("/:productCode", this.controller.delete);
  }
}

export default new ProductRouter().router;
