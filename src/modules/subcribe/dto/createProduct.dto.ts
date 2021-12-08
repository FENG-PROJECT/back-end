import { IsOptional, IsString } from 'class-validator';
import { ProductStatus } from 'src/utils/constant';

export class CreateProductDto {
  @IsString()
  readonly category: string;

  @IsString()
  readonly subCategoryUrl: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly price: string;

  @IsString()
  readonly arrival: string;

  @IsString()
  readonly color: string;

  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly images: string;

  @IsString()
  readonly status: ProductStatus;

  @IsString()
  productStocks: string; //productStock[];
}
