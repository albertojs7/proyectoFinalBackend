import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, min, Min } from "class-validator";
import { DifficultyLevel, ChallengeState } from '../../domain/challenge.entity';
import { Transform } from "class-transformer";
import { ApiProperty, PartialType } from "@nestjs/swagger";

// Para validación con @IsIn (mejor que @IsEnum con unions)
export const DifficultyValues: readonly DifficultyLevel[] = ['EASY','MEDIUM','HARD'] as const;
export const StateValues: readonly ChallengeState[] = ['DRAFT','PUBLISHED','ARCHIVED'] as const;

export class CreateChallengeDto {
  @ApiProperty({ example: 'Binary Search', description: 'Título del challenge' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Implementa el algoritmo de búsqueda binaria', description: 'Descripción del challenge' })
  @IsString()
  description!: string;

  @ApiProperty({ example: ['algorithms', 'search', 'arrays'], isArray: true, type: String })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags!: string[];

  @ApiProperty({ enum: DifficultyValues, example: 'MEDIUM', enumName: 'DifficultyLevel' })
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value))
  @IsIn(DifficultyValues)
  difficulty!: DifficultyLevel;

  @ApiProperty({ example: 2, description: 'Tiempo límite (segundos)', minimum: 1 })
  @IsInt()
  @IsPositive()
  @Min(1)
  timeLimit!: number;

  @ApiProperty({ example: 256, description: 'Memoria límite (MB)', minimum: 1 })
  @IsInt()
  @IsPositive()
  @Min(1)
  memoryLimit!: number;
}

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {
  @ApiProperty({ enum: StateValues, required: false, enumName: 'ChallengeState' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value))
  @IsIn(StateValues)
  state?: ChallengeState;
}

export class ChallengeResponseDto {
  id!: string;
  title!: string;
  description!: string;
  tags!: string[];
  difficulty!: DifficultyLevel;
  timeLimit!: number;
  memoryLimit!: number;
  state!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
