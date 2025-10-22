import { Inject, Injectable } from "@nestjs/common";
import { CHALLENGE_REPOSITORY } from "../../tokens";
import { Challenge } from "../../../domain/challenge.entity";
import { UpdateChallengeDto } from "../../dtos/challenge.dto";
import { ChallengeRepository } from "../../../domain/challenge.repository";


@Injectable()
export class UpdateChallengeUseCase {
    constructor(@Inject(CHALLENGE_REPOSITORY) private readonly challengeRepository: ChallengeRepository) {}

    async execute(challenge: UpdateChallengeDto): Promise<Challenge> {
        const existingChallenge = await this.challengeRepository.findById(challenge.id);
        if (!existingChallenge) {
            throw new Error('Challenge not found');
        }
        existingChallenge.title = challenge.title ?? existingChallenge.title;
        existingChallenge.description = challenge.description ?? existingChallenge.description;
        existingChallenge.tags = challenge.tags ?? existingChallenge.tags;
        existingChallenge.difficulty = challenge.difficulty ?? existingChallenge.difficulty;
        existingChallenge.timeLimit = challenge.timeLimit ?? existingChallenge.timeLimit;
        existingChallenge.memoryLimit = challenge.memoryLimit ?? existingChallenge.memoryLimit;
        const updatedChallenge = await this.challengeRepository.update(existingChallenge.id, existingChallenge);
        if (!updatedChallenge) {
            throw new Error('Failed to update challenge');
        }
        return updatedChallenge;
    }
}