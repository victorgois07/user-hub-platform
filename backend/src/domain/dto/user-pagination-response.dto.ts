import { UserWithoutPassword } from '../repositories/user.repository.interface';

export class UserPaginationResponseDto {
  data: UserWithoutPassword[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
