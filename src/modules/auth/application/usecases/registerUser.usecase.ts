import { UserRepository } from "../../domain/user.repository";
import { User, UserRole } from "../../domain/user.entity";
import { randomUUID } from 'crypto';
import { CreateUserDto } from "../dto/registerUser.dto";
import * as bcrypt from 'bcrypt'
import { BadRequestException } from '@nestjs/common';

export class RegisterUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(input: CreateUserDto): Promise<User> {
        const exist = await this.userRepository.findByEmail(input.email)
        console.log(input.email)
        if (exist) {
            throw new BadRequestException('Email already registered')
        }
        const hashed = await bcrypt.hash(input.password, 10)
        const user = new User(randomUUID(), input.name, input.email, input.role, hashed)
        return await this.userRepository.save(user)
    }
}