import { DocumentType, User as UserPrisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';

export class UserEntity implements UserPrisma {
  @IsUUID()
  readonly id: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly document: string;

  @IsEnum(DocumentType)
  readonly documentType: DocumentType;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;

  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
