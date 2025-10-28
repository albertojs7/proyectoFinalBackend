import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../application/dto/registerUser.dto';
import { LoginUserDto } from '../application/dto/loginUser.dto';
import { LoginResponseDto } from '../application/dto/loginResponse.dto';
import { RegisterUserUseCase } from '../application/usecases/registerUser.usecase';
import { LoginUserUseCase } from '../application/usecases/loginUser.usecase';
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.registerUserUseCase.execute(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token and user data',
    type: LoginResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or user not found'
  })
  async login(@Body() body: LoginUserDto): Promise<LoginResponseDto> {
    return await this.loginUserUseCase.execute(body);
  }
}
