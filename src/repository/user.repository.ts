import db from "../config/db.config";
import { User } from "../models/user.model";

export default db.getRepository(User).extend({
  findByEmail(email: string) {
    return this.findOneBy({ email });
  },
});
