import { Inject, Injectable } from "@nestjs/common";
import { TEST_CASE_REPOSITORY } from "../../tokens";
import { TestCaseRepository } from "../../../domain/test-case.repository";


@Injectable()
export class DeleteTestCaseUseCase {
    constructor(
        @Inject(TEST_CASE_REPOSITORY)
        private readonly testCaseRepository: TestCaseRepository
    ) {}
    async execute(id: string): Promise<void> {
        const existingTestCase = await this.testCaseRepository.findById(id);
        if (!existingTestCase) {
            throw new Error('Test case not found');
        }
        await this.testCaseRepository.delete(id);
    }
}