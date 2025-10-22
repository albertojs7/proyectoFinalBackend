import { Inject, Injectable } from "@nestjs/common";
import { ChallengeRepository } from "../../../domain/challenge.repository";
import { CHALLENGE_REPOSITORY } from "../../tokens";
import { randomUUID } from "crypto";
import { Challenge, ChallengeState } from "../../../domain/challenge.entity";
import { CreateChallengeDto } from "../../dtos/challenge.dto";


@Injectable()
export class CreateChallengeUseCase {
    constructor(@Inject(CHALLENGE_REPOSITORY)
        private readonly challengeRepository: ChallengeRepository
    ) {}

    async execute(dto: CreateChallengeDto): Promise<Challenge> {
        
        const challenge = new Challenge(
            randomUUID(),
            dto.title,
            dto.description,
            dto.tags,
            dto.difficulty,
            "DRAFT",
            dto.timeLimit,
            dto.memoryLimit,
            new Date(),
            new Date()


        );
        return this.challengeRepository.save(challenge);
    }
}