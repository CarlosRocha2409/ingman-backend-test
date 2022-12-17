import db from "../config/db.config";
import { User } from "../models/user.model";

export class UserRepository {
  private userRepository;

  constructor() {
    this.userRepository = db.getRepository(User);
  }
}
