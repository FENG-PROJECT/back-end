import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly phone: string;

  @IsString()
  readonly address: string;

  @IsArray()
  readonly productOrders: [{ productId: number; amount: number }];
}
