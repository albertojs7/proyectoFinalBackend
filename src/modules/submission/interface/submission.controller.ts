import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
import { CreateSubmissionUseCase } from '../application/usecases/createSubmission.UseCase';
import { CreateSubmissionDto } from '../application/dto/createSubmission.dto';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly createSubmissionUseCase: CreateSubmissionUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Encolar un submission para ser procesado por los workers' })
  @ApiBody({ type: CreateSubmissionDto })
  @ApiCreatedResponse({ description: 'Submission encolado (QUEUED)' })
  async create(@Body() dto: CreateSubmissionDto) {
    const submission = await this.createSubmissionUseCase.execute(dto);
    return { id: submission.id, status: submission.status };
  }
}
