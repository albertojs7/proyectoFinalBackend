import { Module } from "@nestjs/common";
import { ChallengesController } from "./challenges.controller";
import { InMemoryChallengeRepository } from "../infrastructure/inmemory/challenge.repository.inmemory";
import { CHALLENGE_REPOSITORY, TEST_CASE_REPOSITORY } from "../application/tokens";
import { PrismaService } from "../../../shared/infrastructure/prisma.service";
import { PrismaTestCaseRepository } from "../infrastructure/prisma/prisma-test-case.repository";
import { PrismaChallengeRepository } from "../infrastructure/prisma/prisma-challenge.repository";
import { CreateChallengeUseCase } from "../application/usecases/challenges/create-challenge.uc";
import { UpdateChallengeUseCase } from "../application/usecases/challenges/update-challenge.uc";
import { ListChallengesUseCase } from "../application/usecases/challenges/list-chalenges.uc";
import { DeleteChallengeUseCase } from "../application/usecases/challenges/delete-challenge.uc";
import { CreateTestCaseUseCase } from "../application/usecases/test-cases/create-test-case.uc";
import { UpdateTestCaseUseCase } from "../application/usecases/test-cases/update-test-case.uc";
import { ListTestCaseUseCase } from "../application/usecases/test-cases/list-test-case.uc";
import { DeleteTestCaseUseCase } from "../application/usecases/test-cases/delete-test-case.uc";
import { TestCaseController } from "./test-case.controller";
import { AuthModule } from "../../auth/interface/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [ChallengesController, TestCaseController],
    providers: [
        PrismaService,
        {provide: TEST_CASE_REPOSITORY, useClass: PrismaTestCaseRepository },
        {provide: CHALLENGE_REPOSITORY, useClass: PrismaChallengeRepository},
        //{provide: CHALLENGE_REPOSITORY, useClass: InMemoryChallengeRepository},
        CreateChallengeUseCase,UpdateChallengeUseCase,
        ListChallengesUseCase,DeleteChallengeUseCase,

        CreateTestCaseUseCase,UpdateTestCaseUseCase,
        ListTestCaseUseCase,DeleteTestCaseUseCase
    ]
})
export class ChallengesModule {}
