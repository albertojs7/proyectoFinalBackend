import { Body, Controller, Post } from '@nestjs/common'
import { CreateSubmissionUseCase } from '../application/usecases/createSubmission.UseCase'
import { CreateSubmissionDto } from '../application/dto/createSubmission.dto'

@Controller('submissions')
export class SubmissionController {
    constructor(private readonly createSubmissionUseCase: CreateSubmissionUseCase) {}

    @Post()
    async create(@Body() dto: CreateSubmissionDto) {
        const submission = await this.createSubmissionUseCase.execute(dto)
        return { id: submission.id, status: submission.status }
    }
}