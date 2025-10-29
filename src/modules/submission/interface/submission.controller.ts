import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common'
import { CreateSubmissionUseCase } from '../application/usecases/createSubmission.UseCase'
import { CreateSubmissionDto } from '../application/dto/createSubmission.dto'
import { GetPresignedUrlDto } from '../application/dto/getPresignedUrl.dto'
import { GetPresignedUrlUseCase } from '../application/usecases/getPresignedUrl.usecase'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard'

interface AuthenticatedRequest extends Request {
    user: { id: string; email: string; role: string };
}

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionController {
    constructor(private readonly createSubmissionUseCase: CreateSubmissionUseCase, private readonly getPresignedUseCase: GetPresignedUrlUseCase, private readonly jwtService: JwtService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new submission' })
    @ApiResponse({
        status: 201,
        description: 'Submission created successfully',
        schema: {
            example: { id: 'uuid-123', status: 'QUEUED' }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid submission data'
    })
    async create(@Body() dto: CreateSubmissionDto) {
        const submission = await this.createSubmissionUseCase.execute(dto)
        return { id: submission.id, status: submission.status }
    }

    @Post('presignedurl')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get presigned URL for uploading code to S3' })
    @ApiResponse({
        status: 200,
        description: 'Presigned URL generated successfully',
        schema: {
            example: { 
                url: 'https://bucket.s3.amazonaws.com/submissions/user123/1729607800-solution.cpp?X-Amz-Algorithm=...'
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid file name or unsupported file type'
    })
    @ApiResponse({
        status: 401,
        description: 'Missing or invalid JWT token'
    })
    async getPresignedUrl(@Body() dto: GetPresignedUrlDto, @Req() req: AuthenticatedRequest) {
        const userId = req.user.id;
        return await this.getPresignedUseCase.execute(userId, dto.fileName);
    }
}
