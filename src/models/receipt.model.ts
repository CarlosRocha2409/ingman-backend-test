import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ReceiptDetail } from "./receipt_detail.model";
import { User } from "./user.model";

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  userId!: number;

  @ManyToOne(() => User, (user) => user.receipts)
  @JoinColumn({
    name: "userId",
  })
  user!: User;

  @OneToMany(() => ReceiptDetail, (rd) => rd.receipt)
  details!: ReceiptDetail[];

  @Column({
    nullable: false,
    default: 1,
    enum: [1, 0],
  })
  active!: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at!: Date;
}
