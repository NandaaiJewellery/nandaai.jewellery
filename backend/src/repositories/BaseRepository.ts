import { Model, ModelStatic, FindOptions, WhereOptions } from "sequelize";

export class BaseRepository<T extends Model> {
    protected model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    async findAll(options?: FindOptions<T>) {
        return this.model.findAll(options);
    }

    async findOne(where: WhereOptions<T["_attributes"]>) {
        return this.model.findOne({ where });
    }

    async findById(id: number | string) {
        return this.model.findByPk(id);
    }

    async create(data: Partial<T["_creationAttributes"]>) {
        return this.model.create(data as any);
    }

    async update(instance: T, data: Partial<T["_attributes"]>) {
        return instance.update(data);
    }

    async delete(where: WhereOptions<T["_attributes"]>) {
        return this.model.destroy({ where });
    }
}