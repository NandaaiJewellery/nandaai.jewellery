import dotenv from "dotenv";
dotenv.config();

import { Server } from "./server";
import { Database } from "./config/database";
import { initModels } from "./models";

class App {
  private server: Server;
  private database: Database;
  private readonly PORT: string = process.env.EXPRESS_PORT!

  constructor() {
    this.server = new Server();
    this.database = new Database();
  }

  public async start() {
    initModels(this.database.getInstance());

    await this.database.connect();
    this.server.listen(this.PORT);
  }
}

new App().start();