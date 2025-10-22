import { Injectable, Inject } from "@nestjs/common";
import { Challenge, ChallengeState } from "../../domain/challenge.entity";
import { ChallengeRepository } from "../../domain/challenge.repository";
import { CreateChallengeDTO } from "../dtos/create-challenge.dto";
import { randomUUID } from "node:crypto";
import { CHALLENGE_REPOSITORY } from "../tokens";

@Injectable()
export class CreateChallengeUseCase {
    constructor(
        @Inject(CHALLENGE_REPOSITORY)
        private readonly challengeRepository: ChallengeRepository
    ) {}

    async execute(input: CreateChallengeDTO): Promise<Challenge> {
        const { title, difficulty, tags, timeLimit, memoryLimit, description } = input;
        const challenge = new Challenge(
            randomUUID(),
            title,
            description,
            tags,
            difficulty,
            "DRAFT",
            timeLimit,
            memoryLimit,
            new Date(),
            new Date()
        );
        return this.challengeRepository.save(challenge);
    }
}