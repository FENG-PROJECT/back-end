import { IsOptional, IsString } from 'class-validator';

export class CreateBuyerDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}

export class UpdateBuyerDto {
  @IsOptional()
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsString()
  readonly companyDescription: string;

  @IsOptional()
  @IsString()
  public avatar: string;
}
