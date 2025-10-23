import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
} from "@nestjs/swagger";
import { CreateSubmissionUseCase } from "../application/usecases/createSubmission.UseCase";
import { CreateSubmissionDto } from "../application/dto/createSubmission.dto";

@ApiTags("submissions")
@Controller("submissions")
export class SubmissionController {
  constructor(
    private readonly createSubmissionUseCase: CreateSubmissionUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: "Crear una nueva submission" })
  @ApiCreatedResponse({ description: "Submission QUEUED" })
  async create(@Body() dto: CreateSubmissionDto) {
    const submission = await this.createSubmissionUseCase.execute(dto);
    return { id: submission.id, status: submission.status };
  }
}
