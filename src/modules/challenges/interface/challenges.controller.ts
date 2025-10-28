import { Body, Controller, Get, Post, Put, Param, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateChallengeUseCase } from '../application/usecases/challenges/create-challenge.uc';
import { ListChallengesUseCase } from '../application/usecases/challenges/list-chalenges.uc';
import { UpdateChallengeUseCase } from '../application/usecases/challenges/update-challenge.uc';
import { DeleteChallengeUseCase } from '../application/usecases/challenges/delete-challenge.uc';
import { CreateChallengeDto, UpdateChallengeDto, ChallengeResponseDto } from '../application/dtos/challenge.dto';



@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
    constructor(
    private readonly createChallenge: CreateChallengeUseCase,
    private readonly listChallenges: ListChallengesUseCase,
    // private readonly getChallengeById: GetChallengeByIdUseCase,
    // private readonly listByDifficulty: ListChallengesByDifficultyUseCase,
    // private readonly listByTag: ListChallengesByTagUseCase,
    private readonly updateChallenge: UpdateChallengeUseCase,
    private readonly deleteChallenge: DeleteChallengeUseCase,
    ) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new challenge' })
  @ApiResponse({ status: 201, description: 'The challenge has been created.', type: ChallengeResponseDto })
  async create(@Body() dto: CreateChallengeDto) {
    return this.createChallenge.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lists all challenges' })
  @ApiOkResponse({ description: 'List of challenges', type: [ChallengeResponseDto] })
  async list() {
    return this.listChallenges.execute();
  }
//   @Get()
//   async list(@Query('difficulty') difficulty?: DifficultyLevel, @Query('tag') tag?: string) {
//     if (difficulty) return this.listByDifficulty.execute(difficulty);
//     if (tag) return this.listByTag.execute(tag);
//     return this.listChallenges.execute();
//   }

//   @Get(':id')
//   async getById(@Param('id') id: string) {
//     return this.getChallengeById.execute(id);
//   }

  @Put(':id')
  @ApiOperation({ summary: 'Updates a challenge' })
  @ApiOkResponse({ description: 'The challenge has been updated.', type: ChallengeResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateChallengeDto) {
    return this.updateChallenge.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a challenge' })
  @ApiOkResponse({ description: 'The challenge has been deleted.' })
  async delete(@Param('id') id: string) {
    await this.deleteChallenge.execute(id);
    return { message: 'Challenge deleted successfully' };
  }
}

    
