import db from "../config/db.config";
import { User } from "../models/user.model";

export default db.getRepository(User);
