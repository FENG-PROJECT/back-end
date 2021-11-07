import { IsString } from 'class-validator';

export class ChangeEmailDto {
  @IsString()
  readonly newEmail: string;
}