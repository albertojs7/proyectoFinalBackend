import { Inject, Injectable } from "@nestjs/common";
import { CHALLENGE_REPOSITORY } from "../../tokens";
import { ChallengeRepository } from "../../../domain/challenge.repository";


@Injectable()
export class ListChallengeByTagUseCase {
    constructor(@Inject(CHALLENGE_REPOSITORY) private readonly challengeRepository: ChallengeRepository
        ) {}
    async execute(tag: string): Promise<any> {
        const challenges = await this.challengeRepository.findByTag(tag);
        return challenges;
    }
}