import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRoutes {
  router: Router;
  controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.controller.getAll);
    this.router.post("/", this.controller.create);
    this.router.get("/:userId", this.controller.getById);
    this.router.put("/:userId", this.controller.update);
  }
}

export default new UserRoutes().router;
