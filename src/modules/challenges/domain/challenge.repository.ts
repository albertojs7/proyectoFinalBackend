import { Challenge } from './challenge.entity';
import { DifficultyLevel } from './challenge.entity';

export interface ChallengeRepository {
    findAll(): Promise<Challenge[]>;
    findById(id: string): Promise<Challenge | null>;
    findByDifficulty(difficulty: DifficultyLevel): Promise<Challenge[]>;
    findByTag(tag: string): Promise<Challenge[]>;
    save(challenge: Challenge): Promise<Challenge>;
    update(id: string, challenge: Partial<Challenge>): Promise<Challenge | null>;
    delete(id: string): Promise<boolean>;
}