import { TestCase } from "./test-case.entity";

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
export type ChallengeState  = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';


export class Challenge {
    constructor(
        public readonly id: string,
        public title: string,
        public description: string,
        public tags: string[],
        public difficulty: DifficultyLevel,
        public state: ChallengeState = 'DRAFT',
        public timeLimit: number,
        public memoryLimit: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public testCases: TestCase[] = [],
    ) {}
    publish() {
    if (this.state !== 'DRAFT') {
      throw new Error('Only draft challenges can be published');
    }
    this.state = 'PUBLISHED';
  }

  addTestCase(testCase: TestCase) {
    this.testCases.push(testCase);
  }

  removeTestCase(testCaseId: string) {
    this.testCases = this.testCases.filter(tc => tc.id !== testCaseId);
  }
}