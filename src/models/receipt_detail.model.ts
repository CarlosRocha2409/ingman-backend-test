import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./product.model";
import { Receipt } from "./receipt.model";

@Entity()
export class ReceiptDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  receiptId!: number;

  @ManyToOne(() => Receipt, (r) => r.details)
  @JoinColumn({
    name: "receiptId",
  })
  receipt!: Receipt;

  @Column({
    nullable: false,
  })
  productId!: number;

  @OneToOne(() => Product)
  @JoinColumn({
    name: "productId",
  })
  product!: Product;

  @Column({
    default: 0.15,
  })
  tax!: number;

  @Column({
    nullable: false,
    default: 1,
  })
  quantity!: number;

  @Column({
    nullable: false,
  })
  subtotal!: number;

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
