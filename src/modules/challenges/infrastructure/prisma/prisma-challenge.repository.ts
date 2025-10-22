import { Injectable } from "@nestjs/common";
import { Challenge, DifficultyLevel as DomainDifficulty,
  ChallengeState as DomainState, } from "../../domain/challenge.entity";
import { PrismaService } from "../../../../shared/infrastructure/prisma.service";
import { ChallengeRepository } from "../../domain/challenge.repository";
import { $Enums } from "@prisma/client";


type PrismaDifficulty = $Enums.DifficultyLevel;   // 'EASY' | 'MEDIUM' | 'HARD' (branded)
type PrismaState      = $Enums.ChallengeState;    // 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' (branded)

/** --------- MAPPERS --------- */
// Domain -> Prisma
function toPrismaDifficulty(d: DomainDifficulty): PrismaDifficulty {
  // literales coinciden; necesitamos afirmar el tipo "branded" de Prisma
  switch (d) {
    case 'EASY':   return 'EASY';
    case 'MEDIUM': return 'MEDIUM';
    case 'HARD':   return 'HARD';
    default:
      throw new Error(`Invalid DifficultyLevel: ${d as string}`);
  }
}

function toPrismaState(s: DomainState): PrismaState {
  switch (s) {
    case 'DRAFT':      return 'DRAFT';
    case 'PUBLISHED':  return 'PUBLISHED';
    case 'ARCHIVED':   return 'ARCHIVED';
    default:
      throw new Error(`Invalid ChallengeState: ${s as string}`);
  }
}

// Prisma -> Domain (los literales coinciden; casteo seguro)
function fromPrismaDifficulty(d: PrismaDifficulty): DomainDifficulty {
  return d as DomainDifficulty;
}

function fromPrismaState(s: PrismaState): DomainState {
  return s as DomainState;
}

@Injectable()
export class PrismaChallengeRepository implements ChallengeRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(challenge: Challenge): Promise<Challenge> {
        const created = await this.prisma.challenge.create({
            data: {
                id: challenge.id,
                title: challenge.title,
                description: challenge.description,
                
                tags: challenge.tags,
                timeLimit: challenge.timeLimit,
                memoryLimit: challenge.memoryLimit,
                difficulty: toPrismaDifficulty(challenge.difficulty), 
                state: toPrismaState(challenge.state), 
                
            }, 
        });
        return new Challenge(
            created.id,
            created.title,
            created.description,
             created.tags,
            fromPrismaDifficulty(created.difficulty), 
            fromPrismaState(created.state), 
            created.timeLimit,
            created.memoryLimit,
            created.createdAt,
            created.updatedAt
        );
    }
    async findById(id: string): Promise<Challenge | null> {
        const found = await this.prisma.challenge.findUnique({
            where: { id },
        });
        if (!found) return null;
        return new Challenge(
            found.id,
            found.title,
            found.description,
            found.tags,
            fromPrismaDifficulty(found.difficulty),
            fromPrismaState(found.state),
            found.timeLimit,
            found.memoryLimit,
            found.createdAt,
            found.updatedAt
        );
    }

    async update(id: string, updates: Partial<Challenge>): Promise<Challenge | null> {
        const existing = await this.prisma.challenge.findUnique({
            where: { id },
        });
        if (!existing) return null;
        const updated = await this.prisma.challenge.update({
            where: { id },
            data: {
                title: updates.title ?? existing.title,
                description: updates.description ?? existing.description,
                tags: updates.tags ?? existing.tags,
                difficulty:  updates.difficulty? { set: toPrismaDifficulty(updates.difficulty) }: undefined,

                state:       updates.state
                ? { set: toPrismaState(updates.state) }
                : undefined,
                timeLimit: updates.timeLimit ?? existing.timeLimit,
                memoryLimit: updates.memoryLimit ?? existing.memoryLimit,
            },
        });

        return new Challenge(
            updated.id,
            updated.title,
            updated.description,
            updated.tags,
            fromPrismaDifficulty(updated.difficulty), 
            fromPrismaState(updated.state),
            updated.timeLimit,
            updated.memoryLimit,
            updated.createdAt,
            updated.updatedAt
        );
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await this.prisma.challenge.deleteMany({
            where: { id },
        });
        return deleted.count > 0;
    }

    async findAll(): Promise<Challenge[]> {
        const challenges = await this.prisma.challenge.findMany();
        return challenges.map((ch) =>
            new Challenge(
            ch.id,
            ch.title,
            ch.description,
            ch.tags,
            fromPrismaDifficulty(ch.difficulty), 
            fromPrismaState(ch.state),
            ch.timeLimit,
            ch.memoryLimit,
            ch.createdAt,
            ch.updatedAt
            )
        );
    }

    async findByDifficulty(difficulty: DomainDifficulty): Promise<Challenge[]> {
        const challenges = await this.prisma.challenge.findMany({
            where: { difficulty: toPrismaDifficulty(difficulty) },
        });
        return challenges.map((ch) =>
            new Challenge(
                ch.id,
            ch.title,
            ch.description,
            ch.tags,
            fromPrismaDifficulty(ch.difficulty),
            fromPrismaState(ch.state),
            ch.timeLimit,
            ch.memoryLimit,
            ch.createdAt,
            ch.updatedAt
            )
        );
    }
    async findByTag(tag: string): Promise<Challenge[]> {
        const challenges = await this.prisma.challenge.findMany({
            where: { tags: { has: tag } },
        });
        return challenges.map((ch) =>
            new Challenge(
            ch.id,
            ch.title,
            ch.description,
            ch.tags,
            fromPrismaDifficulty(ch.difficulty),
            fromPrismaState(ch.state),
            ch.timeLimit,
            ch.memoryLimit,
            ch.createdAt,
            ch.updatedAt
            )
        );
    }

}