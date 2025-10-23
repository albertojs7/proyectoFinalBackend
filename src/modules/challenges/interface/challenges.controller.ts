import { Body, Controller, Get, Post, Put, Param, Delete, Patch } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags, PartialType } from "@nestjs/swagger";
import { CreateChallengeUseCase } from '../application/usecases/challenges/create-challenge.uc';
import { ListChallengesUseCase } from '../application/usecases/challenges/list-chalenges.uc';
import { UpdateChallengeUseCase } from '../application/usecases/challenges/update-challenge.uc';
import { DeleteChallengeUseCase } from '../application/usecases/challenges/delete-challenge.uc';
import { CreateChallengeDto, UpdateChallengeDto, ChallengeResponseDto } from '../application/dtos/challenge.dto';
import { ListChallengeByDificultyUseCase } from '../application/usecases/challenges/list-challenge-by-dificulty.us';
import { DifficultyLevel } from '../domain/challenge.entity';
import { ListChallengeByTagUseCase } from '../application/usecases/challenges/list-challenge-by-tag.uc';



@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
    constructor(
        private readonly createChallenge: CreateChallengeUseCase,
    private readonly listChallenges: ListChallengesUseCase,
    // private readonly getChallengeById: GetChallengeByIdUseCase,
    private readonly listByDifficulty: ListChallengeByDificultyUseCase,
    private readonly listByTagchalleng: ListChallengeByTagUseCase,
    private readonly updateChallenge: UpdateChallengeUseCase,
    private readonly deleteChallenge: DeleteChallengeUseCase,
    ) {}

   @Post()
  @ApiOperation({ summary: 'Crea un nuevo challenge' })
  async create(@Body() dto: CreateChallengeDto) {
    return this.createChallenge.execute(dto);
  }

  // @Get()
  //   async list() {
  //       return this.listChallenges.execute();
  //   }
  @Get()
  @ApiOperation({ summary: 'Lista todos los challenges' })
  async list() : Promise<ChallengeResponseDto[]> {
    return this.listChallenges.execute();
  }

  // listar challenge por dificultad
  @Get('difficulty/:difficulty')
  @ApiOperation({ summary: 'Lista challenges por nivel de dificultad' })
  async listByDificulty(@Param('difficulty') difficulty: string): Promise<ChallengeResponseDto[]> {
    return this.listByDifficulty.execute(difficulty as DifficultyLevel);
  }

  // obtener challenges por tag
  @Get('tag/:tag')
  @ApiOperation({ summary: 'Lista challenges por tag' })
  async listByTag(@Param('tag') tag: string): Promise<ChallengeResponseDto[]> {
    return this.listByTagchalleng.execute(tag);
  }
  


//   @Get(':id')
//   async getById(@Param('id') id: string) {
//     return this.getChallengeById.execute(id);
//   }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateChallengeDto) {
    return this.updateChallenge.execute({ ...dto, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deleteChallenge.execute(id);
    return { message: 'Challenge deleted successfully' };
  }
}

    
