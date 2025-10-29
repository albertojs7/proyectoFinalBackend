import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateSubmissionDto {
    @ApiProperty({
        description: 'ID of the user submitting the code',
        example: 'user123'
    })
    @IsString()
    userId!: string;

    @ApiProperty({
        description: 'ID of the challenge being solved',
        example: 'challenge456'
    })
    @IsString()
    challengeId!: string;

    @ApiProperty({
        description: 'Programming language of the code',
        example: 'cpp',
        enum: ['cpp', 'python', 'javascript', 'java', 'go']
    })
    @IsString()
    language!: string;

    @ApiProperty({
        description: 'S3 URL where the code is stored',
        example: 'https://bucket.s3.amazonaws.com/submissions/user123/1729607800-solution.cpp'
    })
    @IsString()
    codeUrl!: string;
}