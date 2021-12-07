import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly phone: string;

  @IsString()
  readonly address: string;

  @IsString()
  readonly email: string;

  @IsArray()
  readonly productOrders: [
    { productId: number; amount: number; size: string; color: string },
  ];

  @IsOptional()
  @IsString()
  readonly note: string;
}
