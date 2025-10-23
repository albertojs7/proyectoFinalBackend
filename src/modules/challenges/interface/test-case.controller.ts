import {  Body,Controller,Delete,Get,Param,Patch,Post,Put,} from '@nestjs/common';
import { CreateTestCaseUseCase } from '../application/usecases/test-cases/create-test-case.uc';
import { UpdateTestCaseUseCase } from '../application/usecases/test-cases/update-test-case.uc';
import { DeleteTestCaseUseCase } from '../application/usecases/test-cases/delete-test-case.uc';
import { CreateTestCaseDto, UpdateTestCaseDto } from '../application/dtos/test-case.dto';
import { ListTestCaseUseCase } from '../application/usecases/test-cases/list-test-case.uc';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TestCase } from '../domain/test-case.entity';
import { ListTestCaseByChallengeUseCase } from '../application/usecases/test-cases/list-test-case-by-challenge.uc';


@Controller('test-cases')
export class TestCaseController {
  constructor(
    private readonly createTestCase: CreateTestCaseUseCase,
    private readonly listByChallenge: ListTestCaseByChallengeUseCase,
    private readonly updateTestCase: UpdateTestCaseUseCase,
    private readonly deleteTestCase: DeleteTestCaseUseCase,
    private readonly listTestCase: ListTestCaseUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo test case' })
  @ApiResponse({ status: 201, description: 'Test case creado exitosamente', type: TestCase })
  async create(@Body() dto: CreateTestCaseDto): Promise<TestCase> {
    return this.createTestCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los test cases' })
  @ApiResponse({ status: 200, description: 'Lista de test cases', type: [TestCase] })
  async listAll(): Promise<TestCase[]> {
    return this.listTestCase.execute();
  }

  @Get('challenge/:challengeId')
  @ApiOperation({ summary: 'Listar test cases de un challenge específico' })
  @ApiResponse({ status: 200, description: 'Lista de test cases', type: [TestCase] })
  async findByChallenge(@Param('challengeId') challengeId: string): Promise<TestCase[]> {
    return this.listByChallenge.execute(challengeId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un test case' })
  @ApiResponse({ status: 200, description: 'Test case actualizado', type: TestCase })
  async update(@Param('id') id: string, @Body() dto: UpdateTestCaseDto): Promise<TestCase> {
    return this.updateTestCase.execute({ ...dto, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un test case' })
  @ApiResponse({ status: 204, description: 'Test case eliminado' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteTestCase.execute(id);
  }

}