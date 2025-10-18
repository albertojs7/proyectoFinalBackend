import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Challenge } from "../../domain/challenge.entity";
import { ChallengeRepository } from "../../domain/challenge.repository";
import { UpdateChallengeDTO } from "../dtos/update-challenge.dto";
import { CHALLENGE_REPOSITORY } from "../tokens";

@Injectable()
export class UpdateChallengeUseCase {
    constructor(
        @Inject(CHALLENGE_REPOSITORY)
        private readonly challengeRepository: ChallengeRepository
    ) {}

    async execute(id: string, input: UpdateChallengeDTO): Promise<Challenge | null> {
        const existingChallenge = await this.challengeRepository.findById(id);
        
        if (!existingChallenge) {
            throw new NotFoundException(`Challenge with id ${id} not found`);
        }

        const updatedChallenge = await this.challengeRepository.update(id, input);
        
        return updatedChallenge;
    }
}
