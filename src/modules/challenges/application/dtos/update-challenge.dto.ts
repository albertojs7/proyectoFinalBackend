import { IsString, IsEnum, IsArray, IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { DifficultyLevel, ChallengeState } from "../../domain/challenge.entity";
import { CreateChallengeDTO } from './create-challenge.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChallengeDTO implements Partial<CreateChallengeDTO> {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
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
    status?: ChallengeState;
}
