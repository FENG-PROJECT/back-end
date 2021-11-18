import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
