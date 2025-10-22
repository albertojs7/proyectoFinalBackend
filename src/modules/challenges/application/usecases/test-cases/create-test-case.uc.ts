
import { randomUUID } from 'crypto';
import { TestCaseRepository } from '../../../domain/test-case.repository';
import { CreateTestCaseDto } from '../../dtos/test-case.dto';
import { TestCase } from '../../../domain/test-case.entity';
import { Inject } from '@nestjs/common';
import { TEST_CASE_REPOSITORY } from '../../tokens';

export class CreateTestCaseUseCase {
  constructor(@Inject(TEST_CASE_REPOSITORY) private readonly testCaseRepo: TestCaseRepository) {}

  async execute(dto: CreateTestCaseDto): Promise<TestCase> {
    
    const testCase = new TestCase(
      randomUUID(),
      dto.challengeId,
      dto.index,
      dto.input,
      dto.output,
    );
    return this.testCaseRepo.create(testCase);
  }
}
