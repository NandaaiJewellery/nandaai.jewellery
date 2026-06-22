import { BaseRepository } from "../repositories/BaseRepository";
import { Model } from "sequelize";

export class BaseService<T extends Model> {
    protected repository: BaseRepository<T>;

    constructor(repository: BaseRepository<T>) {
        this.repository = repository;
    }

    async getAll() {
        return this.repository.findAll();
    }

    async getById(id: number | string) {
        const item = await this.repository.findById(id);
        if (!item) throw new Error("NOT_FOUND");
        return item;
    }

    async create(data: any) {
        return this.repository.create(data);
    }

    async delete(id: number | string) {
        const deleted = await this.repository.delete({ id } as any);
        if (!deleted) throw new Error("NOT_FOUND");
    }
}