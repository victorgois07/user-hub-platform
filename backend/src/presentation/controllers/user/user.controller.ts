import { CreateUserUseCase } from '@/application/use-cases/user/create-user.use-case';
import { DeleteUserUseCase } from '@/application/use-cases/user/delete-user.use-case';
import { FindUserByIdUseCase } from '@/application/use-cases/user/find-user-by-id.use-case';
import { GetAllUsersUseCase } from '@/application/use-cases/user/get-all-users.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/user/update-user.use-case';
import { CreateUserDto } from '@/domain/dto/create-user.dto';
import { PaginationQueryDto } from '@/domain/dto/pagination-query.dto';
import { UserPaginationResponseDto } from '@/domain/dto/user-pagination-response.dto';
import { UserEntity } from '@/domain/entities/user.enity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const validatedDto = plainToInstance(CreateUserDto, createUserDto);
    const result = await this.createUserUseCase.execute(validatedDto);
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ type: PaginationQueryDto })
  @ApiResponse({ status: 200, description: 'Return all users' })
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<UserPaginationResponseDto> {
    const result = await this.getAllUsersUseCase.execute(query);
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Return user by id' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    const result = (await this.findUserByIdUseCase.execute(id)) as UserEntity;
    return result;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ): Promise<UserEntity> {
    const validatedDto = plainToInstance(CreateUserDto, updateUserDto);
    const result = await this.updateUserUseCase.execute(id, validatedDto);
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }
}
