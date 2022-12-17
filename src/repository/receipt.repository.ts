import db from "../config/db.config";
import { Receipt } from "../models/receipt.model";

export default db.getRepository(Receipt);
