import { DataSource } from "typeorm";
import fs from "fs";
// import { User } from "../models/user.model";
import apiLogger from "../logger/api.logger";
import { Product } from "../models/product.model";
// import { Wallet } from "../models/wallet.model";
// import { Discord } from "../models/discord.model";
// import { Guild } from "../models/guild.model";
// import { Mint } from "../models/mint.model";
// import { Event } from "../models/event.model";
// import { EventToUser } from "../models/eventToUser.model";
// import { EventRepository } from "../repository/event.repository";

class DBConfig {
  private static instance: DBConfig;
  AppDataSource: DataSource;
  private hostName: string = process.env.DB_HOST!;
  private port: string = process.env.DB_PORT!;
  private username: string = process.env.DB_USER!;
  private password: string = process.env.DB_PASSWORD!;
  private database: string = process.env.DB!;

  constructor() {
    this.AppDataSource = new DataSource({
      type: "postgres",
      host: this.hostName,
      port: parseInt(this.port),
      username: this.username,
      password: this.password,
      database: this.database,
      synchronize: true,
      entities: [Product],
    });
    this.connect();
  }

  private async connect() {
    this.AppDataSource.initialize()
      .then(() => {
        apiLogger.info("Successfully connected to DB");
      })
      .catch((error) => console.log(error));
  }

  public static getInstance(): DBConfig {
    if (!DBConfig.instance) {
      DBConfig.instance = new DBConfig();
    }
    return DBConfig.instance;
  }
}

export default DBConfig.getInstance().AppDataSource;
