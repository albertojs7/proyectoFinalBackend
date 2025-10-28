import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';

export class GetPresignedUrlDto {
    @ApiProperty({
        description: 'Name of the file to upload (must have valid extension)',
        example: 'solution.cpp',
        pattern: '\\.(cpp|py|js|java|go)$'
    })
    @IsString()
    @MaxLength(50, { message: 'File name must not exceed 50 characters' })
    @Matches(/\.(cpp|py|js|java|go)$/, { 
        message: 'File must have one of these extensions: .cpp, .py, .js, .java, .go' 
    })
    fileName!: string;

    @ApiProperty({
        description: 'MIME type of the file',
        example: 'text/plain',
        default: 'text/plain'
    })
    @IsString()
    fileType?: string;
}