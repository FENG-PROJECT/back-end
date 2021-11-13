import { IsNumber, IsString } from 'class-validator';
import { ProductStatus } from 'src/utils/constant';

export class CreateProductDto {
  @IsNumber()
  readonly subCategoryId: number;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly arrival: string;

  @IsString()
  readonly status: ProductStatus;

  productStocks: productStock[];
}

class productStock {
  @IsString()
  readonly size: string;

  @IsNumber()
  readonly amount: number;
}
