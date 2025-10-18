import { IsString, IsEnum, IsArray, IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { DifficultyLevel, ChallengeStatus } from "../../domain/challenge.entity";
import { CreateChallengeDTO } from './create-challenge.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChallengeDTO implements Partial<CreateChallengeDTO> {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsEnum(DifficultyLevel)
    difficulty?: DifficultyLevel;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsNumber()
    timeLimit?: number;

    @IsOptional()
    @IsNumber()
    memoryLimit?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @IsEnum(ChallengeStatus)
    status?: ChallengeStatus;
}
