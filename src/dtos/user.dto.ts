import { User } from "../models/user.model";

export class UserDTO {
  id: number;
  name: string;
  lastname: string;
  fullName: string;
  active: number;
  created_at: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.lastname = user.lastname;
    this.active = user.active;
    this.fullName = `${user.name} ${user.lastname}`;
    this.created_at = user.created_at;
  }
}
