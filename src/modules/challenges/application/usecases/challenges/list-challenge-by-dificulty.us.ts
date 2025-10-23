import { Inject, Injectable } from "@nestjs/common";
import { CHALLENGE_REPOSITORY } from "../../tokens";
import { ChallengeRepository } from "../../../domain/challenge.repository";
import { Challenge } from "@prisma/client";
import { DifficultyLevel } from "../../../domain/challenge.entity";


@Injectable()
export class ListChallengeByDificultyUseCase {
    constructor(
        @Inject(CHALLENGE_REPOSITORY) private readonly challengeRepository: ChallengeRepository
    ) {}
    async execute(difficulty: DifficultyLevel): Promise<Challenge[]> {
        const challenges = await this.challengeRepository.findByDifficulty(difficulty);
        return challenges;
    }
}