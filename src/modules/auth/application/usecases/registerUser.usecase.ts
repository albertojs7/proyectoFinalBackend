import { UserRepository } from "../../domain/user.repository";
import { User, UserRole } from "../../domain/user.entity";
import { randomUUID } from 'crypto';
import { CreateUserDto } from "../dto/registerUser.dto";
import * as bcrypt from 'bcrypt'

export class RegisterUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(input: CreateUserDto): Promise<User> {
        const exist = await this.userRepository.findByEmail(input.email)
        if (exist) {
            throw new Error('Email already registered')
        }
        const hashed = await bcrypt.hash(input.password, 10)
        const user = new User(randomUUID(), input.name, input.email, UserRole.STUDENT, hashed)
        return await this.userRepository.save(user)
    }
}