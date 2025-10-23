import { Injectable } from "@nestjs/common";
import { TestCaseRepository } from "../../domain/test-case.repository";
import { PrismaService } from "../../../../shared/infrastructure/prisma.service";
import { TestCase } from "../../domain/test-case.entity";


@Injectable()
export class PrismaTestCaseRepository implements TestCaseRepository {
    constructor(private readonly prisma: PrismaService) {}
    async create(testCase: TestCase): Promise<TestCase> {
        const created = await this.prisma.testCase.create({
            data: {
                id: testCase.id,
                challengeId: testCase.challengeId,
                input: testCase.input,
                output: testCase.output,
                index: testCase.index,
            },
        });
        return new TestCase(
            created.id,
            created.challengeId,
            created.index,
            created.input,
            created.output
        );
    }

    async findAll(): Promise<TestCase[]> {
        const testCases = await this.prisma.testCase.findMany();
        return testCases.map(
            (tc) =>
                new TestCase(tc.id, tc.challengeId, tc.index, tc.input, tc.output)
        );
    }

    async findByChallengeId(challengeId: string): Promise<TestCase[]> {
        const testCases = await this.prisma.testCase.findMany({
            where: { challengeId },
        });
        return testCases.map(
            (tc) =>
                new TestCase(tc.id, tc.challengeId, tc.index, tc.input, tc.output)
        );
    }
    async findById(id: string): Promise<TestCase | null> {
        const tc = await this.prisma.testCase.findUnique({
            where: { id },
        });
        if (!tc) return null;
        return new TestCase(tc.id, tc.challengeId, tc.index, tc.input, tc.output);
    }

    async findByChallengeIdAndIndex(challengeId: string, index: number): Promise<TestCase | null> {
        const tc = await this.prisma.testCase.findFirst({
            where: { challengeId, index },
        });
        if (!tc) return null;
        return new TestCase(tc.id, tc.challengeId, tc.index, tc.input, tc.output);
    }
    async update(testCase: TestCase): Promise<TestCase> {
        const updated = await this.prisma.testCase.update({
            where: { id: testCase.id },
            data: {
                challengeId: testCase.challengeId,
                input: testCase.input,
                output: testCase.output,
                index: testCase.index,
            },
        });
        return new TestCase(
            updated.id,
            updated.challengeId,
            updated.index,
            updated.input,
            updated.output
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.testCase.delete({
            where: { id },
        });
    }
    
}