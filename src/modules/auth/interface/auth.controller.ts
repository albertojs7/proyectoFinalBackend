import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../application/dto/registerUser.dto';
import { LoginUserDto } from '../application/dto/loginUser.dto';
import { RegisterUserUseCase } from '../application/usecases/registerUser.usecase';
import { LoginUserUseCase } from '../application/usecases/loginUser.usecase';
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() body: CreateUserDto) {
    return await this.registerUserUseCase.execute(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  async login(@Body() body: LoginUserDto) {
    return await this.loginUserUseCase.execute(body);
  }

}
