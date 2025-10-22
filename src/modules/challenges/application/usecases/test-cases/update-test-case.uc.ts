import { Inject, Injectable } from "@nestjs/common";
import { TestCaseRepository } from "../../../domain/test-case.repository";
import { UpdateTestCaseDto } from "../../dtos/test-case.dto";
import { TestCase } from "../../../domain/test-case.entity";
import { TEST_CASE_REPOSITORY } from "../../tokens";


@Injectable()
export class UpdateTestCaseUseCase {
    constructor(
        @Inject(TEST_CASE_REPOSITORY) private readonly testCaseRepository: TestCaseRepository
    ) {}

    async execute(testCase: UpdateTestCaseDto ) : Promise <any> {
        const existingTestCase =  await this.testCaseRepository.findById(testCase.id);
        if (!existingTestCase) {
            throw new Error('Test case not found');
        }
        existingTestCase.input = testCase.input ?? existingTestCase.input;
        existingTestCase.output = testCase.output ?? existingTestCase.output;
        existingTestCase.index = testCase.index ?? existingTestCase.index;

        const updatedTestCase = await this.testCaseRepository.update(existingTestCase);
        return updatedTestCase;
    }
}