import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator'
import { UserRole } from '../../domain/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty()
  @IsEnum(UserRole)
  role!: UserRole;
}
