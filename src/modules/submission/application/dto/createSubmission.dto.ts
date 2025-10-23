import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsString()
  challengeId!: string;

  @ApiProperty({ enum: ['python', 'node', 'cpp', 'java'] })
  @IsString()
  @IsIn(['python', 'node', 'cpp', 'java'])
  language!: string;

  @ApiProperty()
  @IsString()
  code!: string;
}
