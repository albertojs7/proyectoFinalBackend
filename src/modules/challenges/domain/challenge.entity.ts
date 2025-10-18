export enum DifficultyLevel {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard'
}

export enum ChallengeStatus {
    DRAFT = 'Draft',
    PUBLISHED = 'Published',
    ARCHIVED = 'Archived'
}

export class Challenge {
    constructor(
        public readonly id: string,
        public title: string,
        public difficulty: DifficultyLevel,
        public tags: string[],
        public timeLimit: number,
        public memoryLimit: number,
        public description: string,
        public status: ChallengeStatus = ChallengeStatus.DRAFT,
    ){}
}
