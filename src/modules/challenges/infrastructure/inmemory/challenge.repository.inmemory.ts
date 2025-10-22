import { Injectable } from '@nestjs/common';
import { Challenge, DifficultyLevel } from '../../domain/challenge.entity';
import { ChallengeRepository } from '../../domain/challenge.repository';

@Injectable()
export class InMemoryChallengeRepository implements ChallengeRepository {
    private challenges: Challenge[] = [];

    async findAll(): Promise<Challenge[]> {
        return [...this.challenges];
    }

    async findById(id: string): Promise<Challenge | null> {
        const challenge = this.challenges.find(c => c.id === id);
        return challenge || null;
    }

    async findByDifficulty(difficulty: DifficultyLevel): Promise<Challenge[]> {
        return this.challenges.filter(c => c.difficulty === difficulty);
    }

    async findByTag(tag: string): Promise<Challenge[]> {
        return this.challenges.filter(c => c.tags.includes(tag));
    }

    async save(challenge: Challenge): Promise<Challenge> {
        this.challenges.push(challenge);
        return challenge;
    }

    async update(id: string, updates: Partial<Challenge>): Promise<Challenge | null> {
        const index = this.challenges.findIndex(c => c.id === id);
        
        if (index === -1) {
            return null;
        }

        const existing = this.challenges[index];
        const updated = new Challenge(
            existing.id,
            updates.title ?? existing.title,
            updates.description ?? existing.description,
            updates.tags ?? existing.tags,
            updates.difficulty ?? existing.difficulty,
            updates.state ?? existing.state,
            updates.timeLimit ?? existing.timeLimit,
            updates.memoryLimit ?? existing.memoryLimit,
            existing.createdAt,
            new Date(),

        );

        this.challenges[index] = updated;
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        const initialLength = this.challenges.length;
        this.challenges = this.challenges.filter(c => c.id !== id);
        return this.challenges.length < initialLength;
    }
}