import { Inject, Injectable } from "@nestjs/common";
import { Challenge } from "../../../domain/challenge.entity";
import { ChallengeRepository } from "../../../domain/challenge.repository";
import { CHALLENGE_REPOSITORY } from "../../tokens";


@Injectable()
export class ListChallengesUseCase {
    constructor(
        @Inject(CHALLENGE_REPOSITORY)
        private readonly challengeRepository: ChallengeRepository
    ) {}
    async execute(): Promise<Challenge[]> {
        const challenges = await this.challengeRepository.findAll();
        return challenges;
    }
}