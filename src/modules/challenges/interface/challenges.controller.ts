import { Body, Controller, Get, Post, Put, Param } from '@nestjs/common';
import { CreateChallengeUseCase, UpdateChallengeUseCase, ListChallengesUseCase } from '../application/usecases';
import { CreateChallengeDTO } from '../application/dtos/create-challenge.dto';
import { UpdateChallengeDTO } from '../application/dtos/update-challenge.dto';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
    constructor(
        private readonly createChallengeUseCase: CreateChallengeUseCase,
        private readonly updateChallengeUseCase: UpdateChallengeUseCase,
        private readonly listChallengesUseCase: ListChallengesUseCase
    ) {}

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDTO) {
        return this.updateChallengeUseCase.execute(id, updateChallengeDto);
    }

    @Post()
    async create(@Body() createChallengeDto: CreateChallengeDTO) {
        return this.createChallengeUseCase.execute(createChallengeDto);
    }

    @Get()
    async findAll() {
        return this.listChallengesUseCase.execute();
    }

}
