import { TestCase } from "./test-case.entity";


export interface TestCaseRepository {
  create(testCase: TestCase): Promise<TestCase>;
  findByChallengeId(challengeId: string): Promise<TestCase[]>;
  findById(id: string): Promise<TestCase | null>;
  findByChallengeIdAndIndex(challengeId: string, index: number): Promise<TestCase | null>;
  update(testCase: TestCase): Promise<TestCase>;
  delete(id: string): Promise<void>;
}