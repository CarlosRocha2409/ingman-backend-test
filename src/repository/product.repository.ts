import db from "../config/db.config";
import { Product } from "../models/product.model";

export default db.getRepository(Product);
