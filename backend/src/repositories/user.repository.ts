import { BaseRepository } from "./BaseRepository";
import { User } from "../models";

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string) {
        return this.findOne({ email });
    }
}