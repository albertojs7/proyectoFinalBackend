import { Inject, Injectable } from "@nestjs/common";
import { ChallengeRepository } from "../../../domain/challenge.repository";
import { CHALLENGE_REPOSITORY } from "../../tokens";


@Injectable()
export class DeleteChallengeUseCase {
    constructor(
        @Inject(CHALLENGE_REPOSITORY)
        private readonly challengeRepository: ChallengeRepository
    ) {}
    async execute(id: string): Promise<void> {
        const existingChallenge = await this.challengeRepository.findById(id);
        if (!existingChallenge) {
            throw new Error('Challenge not found');
        }
        await this.challengeRepository.delete(id);
    }
}