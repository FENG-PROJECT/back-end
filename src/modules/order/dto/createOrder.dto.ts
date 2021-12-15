import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentType } from 'src/utils/constant';

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

  @IsEnum(PaymentType)
  readonly paymentType: PaymentType;

  @IsOptional()
  @IsString()
  readonly note: string;
}
