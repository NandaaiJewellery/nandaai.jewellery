import { BaseRepository } from "./BaseRepository";
import { Product } from "../models";
import { FindOptions } from "sequelize";

export class ProductRepository extends BaseRepository<Product> {
    constructor() {
        super(Product);
    }

    async findWithFilters(options: FindOptions<Product>) {
        return this.findAll(options);
    }
}