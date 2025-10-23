import { UserRepository } from "../../domain/user.repository";
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User } from "../../domain/user.entity";
import { LoginUserDto } from "../dto/loginUser.dto";
import { UnauthorizedException } from '@nestjs/common';

export class LoginUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) {}

    async execute(input: LoginUserDto): Promise<{ token: string; user: User }> {
        const user = await this.userRepository.findByEmail(input.email)
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado')
        }
        const isValid = await bcrypt.compare(input.password, user.password)
        if (!isValid) {
            throw new UnauthorizedException('Credenciales invalidas')
        }
        const token = await this.jwtService.signAsync({
            id: user.id,
            role: user.role,
            email: user.email
        })

        return { token, user }
    }
}