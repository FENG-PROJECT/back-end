import { IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  readonly content: string;

  @IsString()
  readonly link: string;
}
