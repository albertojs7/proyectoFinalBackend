import { IsString, IsEnum, IsArray, IsNumber, IsNotEmpty } from 'class-validator';
import { DifficultyLevel } from "../../domain/challenge.entity";
import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeDTO {
    @IsString()
    @IsNotEmpty()
    title!: string;

    
    difficulty!: DifficultyLevel;

    @IsArray()
    @IsString({ each: true })
    tags!: string[];

    @IsNumber()
    timeLimit!: number;

    @IsNumber()
    memoryLimit!: number;

    @IsString()
    @IsNotEmpty()
    description!: string;
}
