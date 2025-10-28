import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({
        description: 'JWT token for authentication',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    token!: string;

    @ApiProperty({
        description: 'User information',
        example: {
            id: 'user123',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'STUDENT',
            createdAt: '2025-10-28T10:30:00Z'
        }
    })
    user!: {
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
    };
}
