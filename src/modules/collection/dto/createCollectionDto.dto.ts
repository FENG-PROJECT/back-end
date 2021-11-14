import { IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;
}
