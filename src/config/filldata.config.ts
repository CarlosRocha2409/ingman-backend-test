import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import { Receipt } from "../models/receipt.model";

import db from "./db.config";
import { ReceiptDetail } from "../models/receipt_detail.model";

async function fillProducts() {
  const prodrepo = db.getRepository(Product);

  const count = await prodrepo.count();
  if (count > 1) return;

  await prodrepo.insert([
    {
      code: "C15IJND",
      description: "Producto tuani 4",
      price: 8,
      quantity: 8000,
      active: 1,
    },
    {
      code: "E15IJND",
      description: "Producto tuani 5",
      price: 10,
      quantity: 9000,
      active: 1,
    },
    {
      code: "E15IGFND",
      description: "Producto tuani 6",
      price: 10,
      quantity: 9000,
      active: 1,
    },
    {
      code: "F15IGFND",
      description: "Producto tuani 7",
      price: 20,
      quantity: 9000,
      active: 1,
    },
    {
      code: "G22IDND",
      description: "Producto tuani 9",
      price: 25,
      quantity: 9000,
      active: 1,
    },
    {
      code: "H22IDND",
      description: "Producto tuani 10",
      price: 35,
      quantity: 9000,
      active: 1,
    },
    {
      code: "I235IDND",
      description: "Producto tuani 11",
      price: 8,
      quantity: 9000,
      active: 1,
    },
    {
      code: "A2SASD",
      description: "Producto tuani",
      price: 6,
      quantity: 222,
      active: 1,
    },
    {
      code: "A12IJND",
      description: "Producto tuani 2",
      price: 8,
      quantity: 4974,
      active: 1,
    },
    {
      code: "B12IJND",
      description: "Producto tuani 3",
      price: 4,
      quantity: 3990,
      active: 1,
    },
  ]);
}

async function fillUsers() {
  const userRepo = db.getRepository(User);

  const count = await userRepo.count();
  if (count > 1) return;

  await userRepo.insert([
    {
      name: "Carlos",
      lastname: "Silva",
      active: 1,
      created_at: "2022-12-18T09:08:57.024Z",
      email: "silva@email.com",
    },
    {
      name: "Eduardo",
      lastname: "Rocha",
      active: 1,
      created_at: "2022-12-18T09:16:15.967Z",
      email: "rocha@email.com",
    },
    {
      name: "Rodolfo",
      lastname: "Estrada",
      active: 1,
      created_at: "2022-12-18T09:16:26.650Z",
      email: "Estrada@email.com",
    },
    {
      name: "Walter",
      lastname: "Gutierrez",
      active: 1,
      created_at: "2022-12-18T09:16:39.662Z",
      email: "Gutierrez@email.com",
    },
    {
      name: "Rick",
      lastname: "Sanchez",
      active: 1,
      created_at: "2022-12-18T09:17:31.527Z",
      email: "Sanchez@email.com",
    },
  ]);
}

const receipts = [
  {
    userId: 1,
  },

  {
    userId: 2,
  },

  {
    userId: 3,
  },

  {
    userId: 4,
  },
  {
    userId: 1,
  },

  {
    userId: 2,
  },

  {
    userId: 3,
  },

  {
    userId: 4,
  },
];
async function fillReceipts() {
  const receiptrepo = db.getRepository(Receipt);
  const count = await receiptrepo.count();
  if (count > 1) return;
  await receiptrepo.insert([...receipts]);
}

async function fillReceiptDetails() {
  const detailRepo = db.getRepository(ReceiptDetail);
  const count = await detailRepo.count();
  if (count > 1) return;

  const details: {
    receiptId: number;
    quantity: number;
    subtotal: number;
    productId: number;
  }[] = [];

  receipts.map((r, index) => {
    details.push(
      {
        receiptId: index + 1,
        quantity: 10,
        subtotal: 1 * 10,
        productId: 1,
      },

      {
        receiptId: index + 1,
        quantity: 7,
        subtotal: 1 * 7,
        productId: 2,
      },

      {
        receiptId: index + 1,
        quantity: 8,
        subtotal: 1 * 8,
        productId: 3,
      },

      {
        receiptId: index + 1,
        quantity: 8,
        subtotal: 1 * 8,
        productId: 3,
      }
    );
  });

  await detailRepo.insert(details);
}

export async function fillData() {
  await fillProducts();
  await fillUsers();
  await fillReceipts();
  await fillReceiptDetails();
}
