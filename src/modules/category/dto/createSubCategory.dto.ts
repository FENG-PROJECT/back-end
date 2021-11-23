import { IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  readonly categoryName: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly url: string;
}
