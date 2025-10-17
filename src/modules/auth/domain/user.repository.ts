import { User } from "./user.entity";

export interface UserRepository {
    findByEmail(email:string): Promise<User | null>;
    save(User: User): Promise<User>;
}