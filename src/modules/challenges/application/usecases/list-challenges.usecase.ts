import { Injectable, Inject } from '@nestjs/common';
import { Challenge } from "../../domain/challenge.entity";
import { ChallengeRepository } from "../../domain/challenge.repository";
import { CHALLENGE_REPOSITORY } from "../tokens";

@Injectable()
export class ListChallengesUseCase {
    constructor(
        @Inject(CHALLENGE_REPOSITORY)
        private readonly challengeRepository: ChallengeRepository
    ) {}

    async execute(): Promise<Challenge[]> {
        return this.challengeRepository.findAll();
    }
}
