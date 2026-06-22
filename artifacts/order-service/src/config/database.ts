import { Sequelize } from "sequelize";
import dev from "../utils";

export class Database {
  private sequelize: Sequelize;
  private readonly databaseConnection: string =
    dev
      ? process.env.DATABASE_URL_DEV!
      : process.env.DATABASE_URL_PROD!;
  constructor() {

    this.sequelize = new Sequelize(this.databaseConnection, {
      dialect: "postgres",
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
      },
    });
  }

  public getInstance(): Sequelize {
    return this.sequelize;
  }

  public async connect() {
    try {
      await this.sequelize.authenticate();
      await this.sequelize.sync({ alter: true });

      if (dev) console.log(`${process.env.NODE_ENV!} Database connected and synced.`);
    } catch (error) {
      console.error("Database connection failed:", error);
      process.exit(1);
    }
  }
}

export const sequelize = new Database().getInstance();