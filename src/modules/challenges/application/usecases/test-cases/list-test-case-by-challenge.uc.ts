import { Inject, Injectable } from "@nestjs/common";
import { TestCaseRepository } from "../../../domain/test-case.repository";
import { TEST_CASE_REPOSITORY } from "../../tokens";


@Injectable()
export class ListTestCaseByChallengeUseCase {
    constructor(
        @Inject(TEST_CASE_REPOSITORY) private readonly testCaseRepository: TestCaseRepository
    ) {}

    async execute(challengeId: string) : Promise <any> {
        const testCases = await this.testCaseRepository.findByChallengeId(challengeId);
        return testCases;
    }
}