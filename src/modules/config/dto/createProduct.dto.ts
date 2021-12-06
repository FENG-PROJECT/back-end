import { IsOptional, IsString } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  readonly customerCare: string;

  @IsString()
  readonly aboutUs: string;

  @IsString()
  readonly contact: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  image: string;
}
