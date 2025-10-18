import { Module } from "@nestjs/common";
import { ChallengesController } from "./challenges.controller";
import { CreateChallengeUseCase, UpdateChallengeUseCase, ListChallengesUseCase } from "../application/usecases";
import { InMemoryChallengeRepository } from "../infrastructure/inmemory/challenge.repository.inmemory";
import { CHALLENGE_REPOSITORY } from "../application/tokens";

@Module({
    controllers: [ChallengesController],
    providers: [
        {
            provide: CHALLENGE_REPOSITORY,
            useClass: InMemoryChallengeRepository
        },
        CreateChallengeUseCase,
        UpdateChallengeUseCase,
        ListChallengesUseCase
    ]
})
export class ChallengesModule {}
