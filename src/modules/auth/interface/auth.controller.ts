import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../application/dto/registerUser.dto';
import { LoginUserDto } from '../application/dto/loginUser.dto';
import { RegisterUserUseCase } from '../application/usecases/registerUser.usecase';
import { LoginUserUseCase } from '../application/usecases/loginUser.usecase';
import { ApiProperty, ApiTags } from "@nestjs/swagger";

class createUserRequest {
    @ApiProperty() name!: string;
    @ApiProperty() email!: string;
    @ApiProperty() password!: string
}
class loginUserRequest {
    @ApiProperty() email!: string;
    @ApiProperty() password!: string
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: createUserRequest) {
    return await this.registerUserUseCase.execute(body);
  }

  @Post('login')
  async login(@Body() body: loginUserRequest) {
    return await this.loginUserUseCase.execute(body);
  }
}
