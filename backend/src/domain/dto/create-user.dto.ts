import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, User as UserPrisma } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto
  implements Omit<UserPrisma, 'id' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: '12345678900' })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({ enum: DocumentType, example: 'CPF' })
  @IsNotEmpty()
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
