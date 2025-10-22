// application/dtos/test-case.dto.ts

import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, IsString, IsUUID} from "class-validator";

export class CreateTestCaseDto {
  @ApiProperty({ example: 'input example', description: 'Entrada del test case' })
  @IsString()
  input!: string;

  @ApiProperty({ example: 'output example', description: 'Salida esperada del test case' })
  @IsString()
  output!: string;

  @ApiProperty({ example: 1, description: 'Índice o número del test case dentro del reto' })
  @Type(() => Number) 
  @IsInt()
  @IsPositive()
  index!: number;

  @ApiProperty({ example: 'd05bacc4-4947-45cb-b3b4-8d017e855e50', description: 'ID del challenge asociado' })
  @IsUUID()
  challengeId!: string;
}

export class UpdateTestCaseDto extends PartialType(CreateTestCaseDto) {
    @ApiProperty({ example: 'testcase_12345', description: 'ID del test case' })
    @IsOptional()
    @IsUUID()
    id!: string;
}

export interface TestCaseResponseDto {
  id: string;
  challengeId: string;
  index: number;
  input: string;
  output: string;
}
